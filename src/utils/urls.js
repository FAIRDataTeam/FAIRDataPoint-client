function repository() {
  return '/fdp'
}

function catalog(c) {
  return `/fdp/catalog/${c.identifier}`
}

function dataset(d) {
  return `/fdp/dataset/${d.identifier}`
}

function distribution(d) {
  return `/fdp/distribution/${d.identifier}`
}

export default {
  repository,
  catalog,
  dataset,
  distribution,
}
