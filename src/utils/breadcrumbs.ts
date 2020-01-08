import urls from './urls'

export type BreadcrumbItem = {
  label: string,
  to: string
}

function createItem(label: string, to: string): BreadcrumbItem {
  return { label, to }
}

function fromLinks(links: any): Array<BreadcrumbItem> {
  const breadcrumbs: Array<BreadcrumbItem> = []

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

function fromLinksWith(entity, toUrl): Array<BreadcrumbItem> {
  const breadcrumbs: Array<BreadcrumbItem> = fromLinks(entity.links)
  breadcrumbs.push(createItem(entity.title, toUrl(entity)))
  return breadcrumbs
}

function fromRepository(repository): Array<BreadcrumbItem> {
  return [createItem(repository.title, urls.repository())]
}

function fromLinksWithCatalog(catalog): Array<BreadcrumbItem> {
  return fromLinksWith(catalog, urls.catalog)
}

function fromLinksWithDataset(dataset): Array<BreadcrumbItem> {
  return fromLinksWith(dataset, urls.dataset)
}

function fromLinksWithDistribution(distribution): Array<BreadcrumbItem> {
  return fromLinksWith(distribution, urls.distribution)
}


export default {
  fromLinks,
  fromRepository,
  fromLinksWithCatalog,
  fromLinksWithDataset,
  fromLinksWithDistribution,
}
