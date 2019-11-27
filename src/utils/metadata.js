import moment from 'moment'


function fromField(label, input, extra = {}) {
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

function rdfLinks() {
  const url = window.location.pathname
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

function commonMetadata(entity) {
  return [
    fromField('Metadata Issued', moment(entity.issued).format('DD-MM-Y'), { sm: true }),
    fromField('Metadata Modified', moment(entity.modified).format('DD-MM-Y'), { sm: true }),
    fromField('Version', entity.version),
    fromField('License', entity.license),
    fromField('Specification', entity.specification),
    fromField('Language', entity.language),
    fromField('Publisher', entity.publisher),
  ]
}

export default {
  fromField,
  rdfLinks,
  commonMetadata,
}
