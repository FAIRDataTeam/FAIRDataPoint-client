import * as $rdf from 'rdflib'
import _ from 'lodash'
import rdfUtils from '@/rdf/utils'
import type {
  NamedNode,
  Quad_Object as QuadObject,
  Quad_Subject as QuadSubject,
} from 'rdflib/lib/tf-types'

export default class Graph {
  store: $rdf.IndexedFormula

  defaultSubject: NamedNode | null = null

  constructor(
    source: string,
    defaultSubject: string | null = null,
    format: string = 'text/turtle',
  ) {
    this.store = $rdf.graph()
    if (defaultSubject) {
      this.defaultSubject = $rdf.namedNode(defaultSubject)
    }

    const base = defaultSubject || ''
    $rdf.parse(this.fixDoubles(source), this.store, base, format, undefined)
  }

  fixDoubles(source: string) {
    // rdflib.js has troubles parsing doubles in scientific notation,
    // so we replace it with xsd:double
    return source.replaceAll(
      /([0-9]+\.[0-9]+[eE]-?[0-9])/g,
      (match) => `"${+match}"^^xsd:double`,
    )
  }

  get subjectTerm() {
    if (!this.defaultSubject) return ''
    return rdfUtils.pathTerm(this.defaultSubject.value)
  }

  findOne(
    term: NamedNode,
    options: { subject?: QuadSubject | string | null; value?: boolean } = {},
  ): string | QuadObject | undefined {
    return _.first(this.find(term, options))
  }

  findAll(
    term: NamedNode,
    options: { subject?: QuadSubject | string | null; value?: boolean } = {},
  ): Array<string | QuadObject> {
    return this.find(term, options)
  }

  private normalizeSubject(subject?: QuadSubject | string | null) {
    if (typeof subject === 'string') {
      return $rdf.namedNode(subject)
    }
    return subject
  }

  private find(
    term: NamedNode,
    options: { subject?: QuadSubject | string | null; value?: boolean },
  ) {
    const subject = this.normalizeSubject(
      _.get(options, 'subject', this.defaultSubject),
    )
    const value = _.get(options, 'value', true)
    const statements = this.store.match(subject ?? null, term)
    return statements.map((s) => (
      _.get(s, `object${value ? '.value' : ''}`)
    ))
  }
}
