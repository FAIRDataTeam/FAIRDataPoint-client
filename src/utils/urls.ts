function repository(): string {
  return '/'
}

function catalog(id: string): string {
  return `/catalog/${id}`
}

function dataset(id: string): string {
  return `/dataset/${id}`
}

function distribution(id: string): string {
  return `/distribution/${id}`
}

function createCatalog(): string {
  return '/create-catalog'
}

function createDataset(catalogId: string): string {
  return `/catalog/${catalogId}/create-dataset`
}

function createDistribution(datasetId: string): string {
  return `/dataset/${datasetId}/create-distribution`
}

export default {
  repository,
  catalog,
  dataset,
  distribution,
  createCatalog,
  createDataset,
  createDistribution,
}
