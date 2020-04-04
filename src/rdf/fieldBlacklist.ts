const repository = [
  'http://purl.org/dc/terms/issued',
  'http://purl.org/dc/terms/modified',
  'http://purl.org/dc/terms/rights',
  'http://www.re3data.org/schema/3-0#institution',
  'http://www.re3data.org/schema/3-0#institutionCountry',
  'http://www.re3data.org/schema/3-0#startDate',
  'http://www.re3data.org/schema/3-0#lastUpdate',
]

const catalog = [
  'http://purl.org/dc/terms/issued',
  'http://purl.org/dc/terms/modified',
  'http://purl.org/dc/terms/rights',
  'http://purl.org/dc/terms/isPartOf',
  'http://xmlns.com/foaf/0.1/homePage',
  'http://www.w3.org/ns/dcat#themeTaxonomy',
]

const dataset = [
  'http://purl.org/dc/terms/issued',
  'http://purl.org/dc/terms/modified',
  'http://purl.org/dc/terms/rights',
  'http://purl.org/dc/terms/isPartOf',
  'http://www.w3.org/ns/dcat#landingPage',
  'http://www.w3.org/ns/dcat#contactPoint',
]

const distribution = [
  'http://purl.org/dc/terms/issued',
  'http://purl.org/dc/terms/modified',
  'http://purl.org/dc/terms/rights',
  'http://purl.org/dc/terms/isPartOf',
  'http://www.w3.org/ns/dcat#byteSize',
]

export default {
  repository,
  catalog,
  dataset,
  distribution,
}
