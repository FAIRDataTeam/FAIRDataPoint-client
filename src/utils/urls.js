function repository() {
  return '/'
}

function catalog(c) {
  return `/catalog/${c.identifier}`
}

function dataset(d) {
  return `/dataset/${d.identifier}`
}

function distribution(d) {
  return `/distribution/${d.identifier}`
}

export default {
  repository,
  catalog,
  dataset,
  distribution,
}
