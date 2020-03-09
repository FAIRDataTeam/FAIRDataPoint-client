import * as $rdf from 'rdflib'
import { FormBuilderFilter, Shacl } from './types'

export class ShaclParser {
  static readonly DEFAULT_URL = 'http://example.com/'

  static readonly DEFAULT_NAMESPACE = $rdf.Namespace(ShaclParser.DEFAULT_URL)

  store: $rdf.IndexedFormula

  filter: FormBuilderFilter

  maxDepth: number

  constructor(shacl: Shacl, filter: FormBuilderFilter, maxDepth: number = 2) {
    this.store = $rdf.graph()
    this.filter = filter
    this.maxDepth = maxDepth
    $rdf.parse(shacl, this.store, ShaclParser.DEFAULT_URL, 'text/turtle', null)
  }
}
