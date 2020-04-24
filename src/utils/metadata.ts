import * as $rdf from 'rdflib'
import moment from 'moment'
import Graph from '@/rdf/Graph'
import { DASH, FDPO } from '@/rdf/namespaces'
import rdfUtils from '@/rdf/utils'
import config from '@/config'
import fieldUtils from '@/components/ShaclForm/fieldUtils'


function field(label, input, extra = {}) {
  if (typeof input !== 'object') {
    return {
      label,
      value: input,
      ...extra,
    }
  }

  if (Array.isArray(input)) {
    return {
      label,
      items: input,
      ...extra,
    }
  }

  return {
    label,
    value: input.label,
    uri: input.uri,
    ...extra,
  }
}


function dateField(label, input, extra = {}) {
  return field(label, moment(input).format(config.dateFormat), extra)
}


function rdfLinks(url) {
  return {
    label: 'Download RDF',
    links: [{
      label: 'ttl',
      uri: `${url}?format=ttl`,
    }, {
      label: 'rdf+xml',
      uri: `${url}?format=rdf`,
    }, {
      label: 'json-ld',
      uri: `${url}?format=jsonld`,
    }],
  }
}


function itemFromPath(path) {
  if (!path) return null

  return {
    label: rdfUtils.pathTerm(path),
    uri: path,
  }
}


function commonMetadata(graph: Graph) {
  return [
    dateField('Metadata Issued', graph.findOne(FDPO('metadataIssued')), { sm: true }),
    dateField('Metadata Modified', graph.findOne(FDPO('metadataModified')), { sm: true }),
  ]
}


function wrapShaclValue(fieldConfig, value) {
  switch (fieldConfig.viewer) {
    case DASH('LabelViewer').value:
      return itemFromPath(value)
    case DASH('URIViewer').value:
      return { label: value, uri: value }
    default:
      return { label: value }
  }
}


function getShaclValue(graph: Graph, fieldConfig) {
  if (fieldConfig.maxCount === 1) {
    const value = graph.findOne($rdf.namedNode(fieldConfig.path))
    return wrapShaclValue(fieldConfig, value)
  }

  const values = graph.findAll($rdf.namedNode(fieldConfig.path))
  return values.map(v => wrapShaclValue(fieldConfig, v))
}


function fromShaclField(graph: Graph, fieldConfig) {
  const name = fieldUtils.getName(fieldConfig)
  return field(name, getShaclValue(graph, fieldConfig))
}


export default {
  field,
  dateField,
  rdfLinks,
  commonMetadata,
  itemFromPath,
  fromShaclField,
}
