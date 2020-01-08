function repository(): string {
  return '/'
}

function catalog(c): string {
  return `/catalog/${c.identifier}`
}

function dataset(d): string {
  return `/dataset/${d.identifier}`
}

function distribution(d): string {
  return `/distribution/${d.identifier}`
}

export default {
  repository,
  catalog,
  dataset,
  distribution,
}
