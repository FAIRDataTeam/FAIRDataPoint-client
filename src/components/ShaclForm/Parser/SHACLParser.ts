import _ from 'lodash'
import * as $rdf from 'rdflib'
import type { NamedNode } from 'rdflib/lib/tf-types'
import {
  DASH, DEFAULT_URI, RDF, RDFS, SHACL,
} from '@/rdf/namespaces'

export class Shape<F> {
  fields: F[]

  constructor(fields: F[] = []) {
    this.fields = fields
  }
}

export class Group<F> {
  iri: string | null

  label: string | null

  comment: string | null

  order: number | null

  fields: F[]

  isReal: boolean

  constructor(
    iri: string | null,
    label: string | null,
    comment: string | null,
    order: number | null,
    isReal: boolean = true,
  ) {
    this.iri = iri
    this.label = label
    this.comment = comment
    this.order = order
    this.fields = []
    this.isReal = isReal
  }

  compare(other: Group<F>): number {
    return this.order > other.order ? 1 : -1
  }
}

export class Field<S> {
  name: string | null

  description: string | null

  path: string

  datatype: string | null

  order: number | null

  minCount: number | null

  maxCount: number | null

  nodeShape: S | null

  group: string | null

  constructor(
    name: string | null,
    description: string | null,
    path: string,
    datatype: string | null,
    order: number | null,
    minCount: number | null,
    maxCount: number | null,
    nodeShape: S | null,
    group: string | null,
  ) {
    this.name = name
    this.description = description
    this.path = path
    this.datatype = datatype
    this.order = order
    this.minCount = minCount
    this.maxCount = maxCount
    this.nodeShape = nodeShape
    this.group = group
  }

  compare(other: Field<S>): number {
    const order = this.order ?? 0
    const otherOrder = other.order ?? 0
    return order > otherOrder ? 1 : -1
  }
}

export abstract class SHACLParser<F extends Field<S>, S extends Shape<F>> {
  store: $rdf.IndexedFormula

  maxDepth: number

  groups: Map<string, Group<F>>

  constructor(shacl: string, maxDepth: number = 2) {
    this.store = $rdf.graph()
    this.maxDepth = maxDepth
    this.groups = new Map<string, Group<F>>()
    $rdf.parse(shacl, this.store, DEFAULT_URI, 'text/turtle', undefined)
  }

  public parse(targetClasses: any[]): S {
    return this.sortFields(targetClasses
      .flatMap((tc) => this.loadShapes(tc))
      .map((s) => this.loadShapeForm(s))
      .reduce(this.mergeShapes))
  }

  public parseAndGroup(targetClasses: any[]): Group<F>[] {
    const shape = targetClasses
      .flatMap((tc) => this.loadShapes(tc))
      .map((s) => this.loadShapeForm(s))
      .reduce(this.mergeShapes)

    return this.group(shape)
  }

  public parseAll(): S {
    return this.store
      .match(null, RDF('type'), SHACL('NodeShape'), null)
      .map((s) => this.loadShapeForm(s.subject))
      .reduce(this.mergeShapes)
  }

  public parseAllAndGroup(): Group<F>[] {
    const shape = this.store
      .match(null, RDF('type'), SHACL('NodeShape'), null)
      .filter((s) => this.store.match(null, null, s.subject).length === 0)
      .map((s) => this.loadShapeForm(s.subject))
      .reduce(this.mergeShapes)

    return this.group(shape)
  }

  group(shape: S): Group<F>[] {
    const groupMap = shape.fields
      .reduce<Map<string, Group<F>>>((
        groups: Map<string, Group<F>>,
        field: F,
      ): Map<string, Group<F>> => {
        if (field.group) {
          const existingGroup = groups.get(field.group)
          if (existingGroup) {
            existingGroup.fields.push(field)
          } else {
            const group = new Group<F>(field.group, null, null, field.order, false)
            group.fields.push(field)
            groups.set(field.group, group)
          }
        } else {
          const group = new Group<F>(field.path, null, null, field.order, false)
          group.fields.push(field)
          groups.set(field.path, group)
        }
        return groups
      }, this.groups)

    return Array.from(groupMap.values())
      .map((group) => {
        group.fields.sort((a, b) => a.compare(b))
        return group
      })
      .sort((a, b) => a.compare(b))
  }

  protected abstract createEmptyShape(): S;

  protected abstract createShape(properties: F[], shape: any): S;

  protected abstract mergeShapes(shape1: S, shape2: S): S;

  protected sortFields(shape: S): S {
    const compareFields = (field1: F, field2: F) => (
      (field1.order ?? 0) > (field2.order ?? 0) ? 1 : -1
    )
    shape.fields.sort(compareFields)
    return shape
  }

  protected abstract createField(
    name: string | null,
    description: string | null,
    path: string | null,
    datatype: string | null,
    order: number | null,
    minCount: number | null,
    maxCount: number | null,
    nodeShape: Shape<F> | null,
    group: string | null,
    prop: any
  ): F[];

  protected loadShapes(targetClass: any): any[] {
    return this.store
      .match(null, SHACL('targetClass'), targetClass, null)
      .map((s) => s.subject)
  }

  protected loadShapeForm(shape: any, level: number = 0): S {
    if (level > this.maxDepth) {
      return this.createEmptyShape()
    }

    const properties = this.loadProps(shape, level)

    const ands = this.store.match(shape, SHACL('and'), null, null)
    const andProperties = ands.flatMap((and) => {
      const elements = _.get(and, 'object.elements') as any[] | undefined
      if (elements) {
        return elements.flatMap((e) => this.loadElement(e, level))
      }
      return []
    })

    return this.createShape(andProperties.concat(properties), shape)
  }

  protected loadProps(node: any, level: number): F[] {
    return this.store.match(node, SHACL('property'), null, null)
      .flatMap((statement) => this.parseShaclProp(statement.object, level))
  }

  protected loadElement(node: any, level: number): F[] {
    const isNodeShape = this.store.match(node, RDF('type'), SHACL('NodeShape'), null).length > 0
    if (isNodeShape) {
      const result = this.loadShapeForm(node, level)
      return result.fields
    }

    return this.parseShaclProp(node, level)
  }

  protected parseShaclProp(prop: any, level: number): F[] {
    const nodeStatement = this.store.match(prop, SHACL('node'), null, null)
    const nodeObject = _.get(nodeStatement, '0.object')
    const nodeShape = nodeObject ? this.loadShapeForm(nodeObject, level + 1) : null

    const groupIri = _.get(this.store.match(prop, SHACL('group')), '0.object')
    const groupIriValue = groupIri ? _.get(groupIri, 'value') : null

    if (groupIriValue && !this.groups.has(groupIriValue)) {
      const group = this.parseShaclGroup(groupIri)
      this.groups.set(groupIriValue, group)
    }

    return this.createField(
      this.getShaclValue(prop, 'name'),
      this.getShaclValue(prop, 'description'),
      this.getShaclValue(prop, 'path'),
      this.getShaclValue(prop, 'datatype'),
      this.parseIntNumber(this.getShaclValue(prop, 'order')),
      this.parseIntNumber(this.getShaclValue(prop, 'minCount')),
      this.parseIntNumber(this.getShaclValue(prop, 'maxCount')),
      nodeShape,
      groupIriValue,
      prop,
    )
  }

  protected parseShaclGroup(group: any): Group<F> {
    return new Group<F>(
      _.get(group, 'value'),
      this.getValue(group, RDFS('label')),
      this.getValue(group, RDFS('comment')),
      this.parseIntNumber(this.getShaclValue(group, 'order')),
    )
  }

  protected getShaclValue(prop: any, term: string): string | null {
    return this.getValue(prop, SHACL(term))
  }

  protected getDashValue(prop: any, term: string): string | null {
    return this.getValue(prop, DASH(term))
  }

  protected getValue(subject: any, predicate: NamedNode): string | null {
    const statement = this.store.match(subject, predicate, null, null)
    return _.get(statement, '0.object.value')
  }

  protected getShaclCollectionValues(prop: any, term: string): string[] | null {
    const statement = this.store.match(prop, SHACL(term), null, null)
    const elements = _.get(statement, '0.object.elements')
    if (!elements) {
      return null
    }

    return _.map(elements, (el) => _.get(el, 'value'))
  }

  protected parseIntNumber(number: string | null): number | null {
    return number ? parseInt(number, 10) : null
  }
}
