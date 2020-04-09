function repository(): string {
  return '/'
}

function catalog(id): string {
  return `/catalog/${id}`
}

function dataset(id): string {
  return `/dataset/${id}`
}

function distribution(id): string {
  return `/distribution/${id}`
}

function createCatalog(): string {
  return '/create-catalog'
}

function createDataset(catalogId): string {
  return `/catalog/${catalogId}/create-dataset`
}

function createDistribution(datasetId): string {
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
