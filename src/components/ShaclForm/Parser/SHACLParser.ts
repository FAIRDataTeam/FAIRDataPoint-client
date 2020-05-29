import _ from 'lodash'
import * as $rdf from 'rdflib'
import {
  DASH, DEFAULT_URI, RDF, SHACL,
} from '@/rdf/namespaces'


export class Shape<F> {
  fields: F[]

  constructor(fields: F[] = []) {
    this.fields = fields
  }
}


export class Field<S> {
  name: string

  path: string

  datatype: string

  minCount: number | null

  maxCount: number | null

  nodeShape: S | null

  constructor(
    name: string,
    path: string,
    datatype: string,
    minCount: number,
    maxCount: number,
    nodeShape: S | null,
  ) {
    this.name = name
    this.path = path
    this.datatype = datatype
    this.minCount = minCount
    this.maxCount = maxCount
    this.nodeShape = nodeShape
  }
}


export abstract class SHACLParser<F extends Field<S>, S extends Shape<F>> {
  store: $rdf.IndexedFormula

  maxDepth: number

  constructor(shacl: string, maxDepth: number = 2) {
    this.maxDepth = maxDepth
    this.store = $rdf.graph()
    $rdf.parse(shacl, this.store, DEFAULT_URI, 'text/turtle', null)
  }

  public parse(targetClasses: $rdf.ValueType[]): S {
    return targetClasses
      .flatMap(tc => this.loadShapes(tc))
      .map(s => this.loadShapeForm(s))
      .reduce(this.mergeShapes)
  }

  protected abstract createEmptyShape(): S;

  protected abstract createShape(properties: F[], shape: $rdf.ValueType): S;

  protected abstract mergeShapes(shape1: S, shape2: S): S;

  protected abstract createField(
    name: string,
    path: string,
    datatype: string,
    minCount: number | null,
    maxCount: number | null,
    nodeShape: Shape<F> | null,
    prop: $rdf.ValueType
  ): F[];

  protected loadShapes(targetClass: $rdf.ValueType): $rdf.ValueType[] {
    return this.store
      .match(null, SHACL('targetClass'), targetClass, null)
      .map(s => s.subject)
  }

  protected loadShapeForm(shape: $rdf.ValueType, level: number = 0): S {
    if (level > this.maxDepth) {
      return this.createEmptyShape()
    }

    const properties = this.loadProps(shape, level)

    const ands = this.store.match(shape, SHACL('and'), null, null)
    const andProperties = ands.flatMap((and) => {
      const elements = _.get(and, 'object.elements')
      if (elements) {
        return elements.flatMap(e => this.loadElement(e, level))
      }
      return []
    })

    return this.createShape(andProperties.concat(properties), shape)
  }

  protected loadProps(node: $rdf.ValueType, level: number): F[] {
    return this.store.match(node, SHACL('property'), null, null)
      .flatMap(statement => this.parseShaclProp(statement.object, level))
  }

  protected loadElement(node: $rdf.ValueType, level: number): F[] {
    const isNodeShape = this.store.match(node, RDF('type'), SHACL('NodeShape'), null).length > 0
    if (isNodeShape) {
      const result = this.loadShapeForm(node, level)
      return result.fields
    }

    return this.parseShaclProp(node, level)
  }

  protected parseShaclProp(prop: $rdf.ValueType, level: number): F[] {
    const nodeStatement = this.store.match(prop, SHACL('node'), null, null)
    const nodeObject = _.get(nodeStatement, '0.object')
    const nodeShape = nodeObject ? this.loadShapeForm(nodeObject, level + 1) : null

    return this.createField(
      this.getShaclValue(prop, 'name'),
      this.getShaclValue(prop, 'path'),
      this.getShaclValue(prop, 'datatype'),
      this.parseIntNumber(this.getShaclValue(prop, 'minCount')),
      this.parseIntNumber(this.getShaclValue(prop, 'maxCount')),
      nodeShape,
      prop,
    )
  }

  protected getShaclValue(prop: $rdf.ValueType, term: string): string | null {
    const statement = this.store.match(prop, SHACL(term), null, null)
    return _.get(statement, '0.object.value')
  }

  protected getDashValue(prop: $rdf.ValueType, term: string): string | null {
    const statement = this.store.match(prop, DASH(term), null, null)
    return _.get(statement, '0.object.value')
  }

  protected parseIntNumber(number: string | null): number | null {
    return number ? parseInt(number, 10) : null
  }
}
