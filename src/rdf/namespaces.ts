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
