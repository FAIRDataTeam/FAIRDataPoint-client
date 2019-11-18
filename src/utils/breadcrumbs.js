import urls from './urls'

function createItem(label, to) {
  return { label, to }
}

function fromLinks(links) {
  const breadcrumbs = []

  const r = links.repository
  if (r) {
    breadcrumbs.push(createItem(r.label, urls.repository()))
  }

  const c = links.catalog
  if (c) {
    breadcrumbs.push(createItem(c.label, urls.catalog(c)))
  }

  const d = links.dataset
  if (d) {
    breadcrumbs.push(createItem(d.label, urls.dataset(d)))
  }

  return breadcrumbs
}

function fromLinksWith(entity, toUrl) {
  const breadcrumbs = fromLinks(entity.links)
  breadcrumbs.push(createItem(entity.title, toUrl(entity)))
  return breadcrumbs
}

function fromRepository(repository) {
  return [createItem(repository.title, urls.repository())]
}

function fromLinksWithCatalog(catalog) {
  return fromLinksWith(catalog, urls.catalog)
}

function fromLinksWithDataset(dataset) {
  return fromLinksWith(dataset, urls.dataset)
}

function fromLinksWithDistribution(distribution) {
  return fromLinksWith(distribution, urls.distribution)
}


export default {
  fromLinks,
  fromRepository,
  fromLinksWithCatalog,
  fromLinksWithDataset,
  fromLinksWithDistribution,
}
