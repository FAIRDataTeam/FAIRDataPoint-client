import * as $rdf from 'rdflib'

export const DEFAULT_URI = 'http://fairdatapoint.org/'
export const DEFAULT_NS = $rdf.Namespace(DEFAULT_URI)

export const DASH = $rdf.Namespace('http://datashapes.org/dash#')
export const DCAT = $rdf.Namespace('http://www.w3.org/ns/dcat#')
export const DCT = $rdf.Namespace('http://purl.org/dc/terms/')
export const FDPO = $rdf.Namespace('http://rdf.biosemantics.org/ontologies/fdp-o#')
export const R3D = $rdf.Namespace('http://www.re3data.org/schema/3-0#')
export const RDF = $rdf.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#')
export const SHACL = $rdf.Namespace('http://www.w3.org/ns/shacl#')
export const XSD = $rdf.Namespace('http://www.w3.org/2001/XMLSchema#')

export const PREFIXES = {
  dash: 'http://datashapes.org/dash#',
  dcat: 'http://www.w3.org/ns/dcat#',
  dcite: 'http://purl.org/spar/datacite/',
  dct: 'http://purl.org/dc/terms/',
  fm: 'https://purl.org/fair-metrics/',
  foaf: 'http://xmlns.com/foaf/0.1/',
  language: 'http://id.loc.gov/vocabulary/iso639-1/',
  r3d: 'http://www.re3data.org/schema/3-0#',
  rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
  sh: 'http://www.w3.org/ns/shacl#',
  sio: 'http://semanticscience.org/resource/',
  wd: 'https://www.wikidata.org/wiki/',
  xsd: 'http://www.w3.org/2001/XMLSchema#',
}
