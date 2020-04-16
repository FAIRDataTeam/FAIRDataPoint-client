import rdfUtils from '@/rdf/utils'
import { DCAT, R3D } from '@/rdf/namespaces'


const repository = {
  targetClasses: [DCAT('Resource'), R3D('Repository')],
  isPartOf: null,
}

const catalog = {
  targetClasses: [DCAT('Resource'), DCAT('Catalog')],
  isPartOf: rdfUtils.repositorySubject,
}

const dataset = {
  targetClasses: [DCAT('Resource'), DCAT('Dataset')],
  isPartOf: rdfUtils.catalogSubject,
}


const distribution = {
  targetClasses: [DCAT('Resource'), DCAT('Distribution')],
  isPartOf: rdfUtils.datasetSubject,
}


export default {
  repository,
  catalog,
  dataset,
  distribution,
}
