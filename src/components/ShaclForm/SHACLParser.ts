import _ from 'lodash'
import * as $rdf from 'rdflib'
import { DASH, RDF, SHACL } from '@/rdf/namespaces'


const URI = 'http://example.com/'
const NAMESPACE = $rdf.Namespace(URI)

export type FieldFilter = (field: string) => boolean

export type FormShape = {
  targetClasses: $rdf.Node[],
  fields: Field[]
}

export type Field = {
  name: string | null,
  path: string | null,
  datatype: string | null,
  nodeKind: string | null,
  class: string | null,
  minCount: number | null,
  maxCount: number | null,
  editor: string | null,
  fieldType: string,
  nodeForm: FormShape | null
}

export class SHACLParser {
  store: $rdf.IndexedFormula

  maxDepth: number

  filter: FieldFilter

  constructor(shacl: string, filter: FieldFilter, maxDepth: number = 2) {
    this.maxDepth = maxDepth
    this.store = $rdf.graph()
    this.filter = filter
    $rdf.parse(shacl, this.store, URI, 'text/turtle', null)
  }

  static filterBlacklist(blacklist: string[]): FieldFilter {
    return field => !_.includes(blacklist, field)
  }

  public parse(shape: string): FormShape {
    return this.loadShapeForm(NAMESPACE(shape))
  }

  private loadShapeForm(shape: $rdf.ValueType, level: number = 0): FormShape {
    if (level > this.maxDepth) {
      return {
        targetClasses: [],
        fields: [],
      }
    }

    const targetClasses = this.store.match(shape, SHACL('targetClass'), null, null).map(s => s.object)

    const properties = this.loadProps(shape, level)

    const ands = this.store.match(shape, SHACL('and'), null, null)
    const andProperties = ands.flatMap((and) => {
      const elements = _.get(and, 'object.elements', [])
      return elements
        .filter(e => this.filter(this.getShaclValue(e, 'path')))
        .flatMap(e => this.loadElement(e, level))
    })

    return { targetClasses, fields: properties.concat(andProperties) }
  }

  private loadProps(node: $rdf.ValueType, level: number): Field[] {
    return this.store.match(node, SHACL('property'), null, null)
      .filter(statement => this.filter(this.getShaclValue(statement.object, 'path')))
      .map(statement => this.parseShaclProp(statement.object, level))
  }

  private loadElement(node: $rdf.ValueType, level: number): Field[] {
    const isNodeShape = this.store.match(node, RDF('type'), SHACL('NodeShape'), null).length > 0
    if (isNodeShape) {
      const result = this.loadShapeForm(node, level)
      return result.fields
    }

    return [this.parseShaclProp(node, level)]
  }

  private parseShaclProp(prop: $rdf.ValueType, level: number): Field {
    const nodeStatement = this.store.match(prop, SHACL('node'), null, null)
    const nodeObject = _.get(nodeStatement, '0.object')
    const nodeForm = nodeObject ? this.loadShapeForm(nodeObject, level + 1) : null

    const editor = this.getDashValue(prop, 'editor')

    const fieldType = editor === DASH('TextAreaEditor').value ? 'textarea' : 'input'

    return {
      name: this.getShaclValue(prop, 'name'),
      path: this.getShaclValue(prop, 'path'),
      datatype: this.getShaclValue(prop, 'datatype'),
      nodeKind: this.getShaclValue(prop, 'nodeKind'),
      class: this.getShaclValue(prop, 'class'),
      minCount: this.parseIntNumber(this.getShaclValue(prop, 'minCount')),
      maxCount: this.parseIntNumber(this.getShaclValue(prop, 'maxCount')),
      editor,
      fieldType,
      nodeForm,
    }
  }

  private getShaclValue(prop: $rdf.ValueType, term: string): string | null {
    const statement = this.store.match(prop, SHACL(term), null, null)
    return _.get(statement, '0.object.value')
  }

  private getDashValue(prop: $rdf.ValueType, term: string): string | null {
    const statement = this.store.match(prop, DASH(term), null, null)
    return _.get(statement, '0.object.value')
  }

  private parseIntNumber(number: string | null): number | null {
    return number ? parseInt(number, 10) : null
  }
}
