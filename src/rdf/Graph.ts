import * as $rdf from 'rdflib'
import _ from 'lodash'
import rdfUtils from '@/rdf/utils'

export default class Graph {
  store

  defaultSubject = null

  constructor(source: string, defaultSubject: string, format: string = 'text/turtle') {
    this.store = $rdf.graph()
    this.defaultSubject = $rdf.namedNode(defaultSubject)
    $rdf.parse(source, this.store, defaultSubject, format, null)
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
    return statements.map(s => _.get(s, `object${value ? '.value' : ''}`))
  }
}
