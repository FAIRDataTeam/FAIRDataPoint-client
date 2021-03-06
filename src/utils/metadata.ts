import _ from 'lodash'
import * as $rdf from 'rdflib'
import moment from 'moment'
import Graph from '@/rdf/Graph'
import {
  DASH, DCT, FDPO, RDFS, XSD,
} from '@/rdf/namespaces'
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
  const metadata = [
    dateField('Metadata Issued', graph.findOne(FDPO('metadataIssued')), { sm: true }),
    dateField('Metadata Modified', graph.findOne(FDPO('metadataModified')), { sm: true }),
  ]

  const conformsTo = graph.findOne(DCT('conformsTo'))
  if (conformsTo) {
    const conformsToLabel = graph.findOne(RDFS('label'), {
      subject: $rdf.namedNode(`${conformsTo}`),
    })

    metadata.push(field('Conforms to', { label: conformsToLabel, uri: conformsTo }))
  }
  return metadata
}


function wrapShaclValue(fieldConfig, value) {
  if (!value) {
    return null
  }

  switch (fieldConfig.viewer) {
    case DASH('LabelViewer').value:
      return itemFromPath(value)
    case DASH('URIViewer').value:
      return { label: value, uri: value }
    default:
      if (fieldConfig.datatype === XSD('dateTime').value) {
        return { label: moment(value).format(config.dateFormat) }
      }
      return { label: value }
  }
}


function getShaclValue(graph: Graph, fieldConfig) {
  if (fieldConfig.maxCount === 1) {
    const value = graph.findOne($rdf.namedNode(fieldConfig.path))
    return wrapShaclValue(fieldConfig, value)
  }

  const values = graph.findAll($rdf.namedNode(fieldConfig.path))
  return values.map(v => wrapShaclValue(fieldConfig, v)).filter(v => v !== null)
}


function fromShaclField(graph: Graph, fieldConfig) {
  const name = fieldUtils.getName(fieldConfig)
  const value = getShaclValue(graph, fieldConfig)

  if (!value || _.isEmpty(value)) {
    return null
  }

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
