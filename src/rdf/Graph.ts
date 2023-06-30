import * as $rdf from 'rdflib'
import _ from 'lodash'
import rdfUtils from '@/rdf/utils'

export default class Graph {
  store

  defaultSubject = null

  constructor(source: string, defaultSubject: string = null, format: string = 'text/turtle') {
    this.store = $rdf.graph()
    if (defaultSubject) {
      this.defaultSubject = $rdf.namedNode(defaultSubject)
    }

    $rdf.parse(this.fixDoubles(source), this.store, defaultSubject, format, null)
  }

  fixDoubles(source) {
    // rdflib.js has troubles parsing doubles in scientific notation,
    // so we replace it with xsd:double
    return source.replaceAll(/([0-9]+\.[0-9]+[eE]-?[0-9])/g, (match) => `"${+match}"^^xsd:double`)
  }

  get subjectTerm() {
    return rdfUtils.pathTerm(this.defaultSubject.value)
  }

  findOne(term, options = {}) {
    return _.first(this.find(term, options))
  }

  findAll(term, options = {}) {
    return this.find(term, options)
  }

  private find(term, options) {
    const subject = _.get(options, 'subject', this.defaultSubject)
    const value = _.get(options, 'value', true)
    const statements = this.store.match(subject, term)
    return statements.map((s) => _.get(s, `object${value ? '.value' : ''}`))
  }
}
