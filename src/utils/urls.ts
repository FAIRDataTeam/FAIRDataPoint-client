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

export default {
  repository,
  catalog,
  dataset,
  distribution,
}
