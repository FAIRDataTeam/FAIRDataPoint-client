import moment from 'moment'
import Graph from '@/rdf/Graph'
import { DCT, FDPO } from '@/rdf/namespaces'
import rdfUtils from '@/rdf/utils'
import config from '@/config'


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
    field('Version', graph.findOne(DCT('hasVersion'))),
    field('License', itemFromPath(graph.findOne(DCT('license')))),
    field('Specification', itemFromPath(graph.findOne(DCT('conformsTo')))),
    field('Language', itemFromPath(graph.findOne(DCT('language')))),
    field('Publisher', itemFromPath(graph.findOne(DCT('publisher')))),
  ]
}


export default {
  field,
  dateField,
  rdfLinks,
  commonMetadata,
  itemFromPath,
}
