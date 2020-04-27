import urls from './urls'
import { DCT } from '@/rdf/namespaces'
import rdfUtils from '@/rdf/utils'

export type BreadcrumbItem = {
  label: string,
  to: string
}

function createItem(label: string, to: string): BreadcrumbItem {
  return { label, to }
}

function fromRepository(graph): Array<BreadcrumbItem> {
  const repositoryTitle = graph.findOne(DCT('title'))
  return [createItem(repositoryTitle, urls.repository())]
}


function fromCatalog(graph): Array<BreadcrumbItem> {
  const repository = graph.findOne(DCT('isPartOf'), { value: false })
  const repositoryTitle = graph.findOne(DCT('title'), { subject: repository })
  return [createItem(repositoryTitle, urls.repository())]
}

function fromWithCatalog(graph) {
  const breadcrumbs = fromCatalog(graph)

  const catalogTitle = graph.findOne(DCT('title'))
  const item = createItem(catalogTitle, urls.catalog(graph.subjectTerm))

  breadcrumbs.push(item)
  return breadcrumbs
}

function fromDataset(graph): Array<BreadcrumbItem> {
  const catalog = graph.findOne(DCT('isPartOf'), { value: false })
  const catalogTitle = graph.findOne(DCT('title'), { subject: catalog })
  const catalogId = rdfUtils.pathTerm(catalog.value)

  const repository = graph.findOne(DCT('isPartOf'), { subject: catalog, value: false })
  const repositoryTitle = graph.findOne(DCT('title'), { subject: repository })
  return [
    createItem(repositoryTitle, urls.repository()),
    createItem(catalogTitle, urls.catalog(catalogId)),
  ]
}

function fromWithDataset(graph) {
  const breadcrumbs = fromDataset(graph)

  const datasetTitle = graph.findOne(DCT('title'))
  const item = createItem(datasetTitle, urls.dataset(graph.subjectTerm))

  breadcrumbs.push(item)
  return breadcrumbs
}

function fromDistribution(graph) {
  const dataset = graph.findOne(DCT('isPartOf'), { value: false })
  const datasetTitle = graph.findOne(DCT('title'), { subject: dataset })
  const datasetId = rdfUtils.pathTerm(dataset.value)

  const catalog = graph.findOne(DCT('isPartOf'), { subject: dataset, value: false })
  const catalogTitle = graph.findOne(DCT('title'), { subject: catalog })
  const catalogId = rdfUtils.pathTerm(catalog.value)

  const repository = graph.findOne(DCT('isPartOf'), { subject: catalog, value: false })
  const repositoryTitle = graph.findOne(DCT('title'), { subject: repository })

  return [
    createItem(repositoryTitle, urls.repository()),
    createItem(catalogTitle, urls.catalog(catalogId)),
    createItem(datasetTitle, urls.dataset(datasetId)),
  ]
}

function fromWithDistribution(graph) {
  const breadcrumbs = fromDistribution(graph)

  const distributionTitle = graph.findOne(DCT('title'))
  const item = createItem(distributionTitle, urls.distribution(graph.subjectTerm))

  breadcrumbs.push(item)
  return breadcrumbs
}

export default {
  createItem,
  fromRepository,
  fromCatalog,
  fromWithCatalog,
  fromDataset,
  fromWithDataset,
  fromDistribution,
  fromWithDistribution,
}
