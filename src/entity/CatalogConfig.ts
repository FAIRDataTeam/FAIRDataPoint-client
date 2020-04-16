import { DCAT } from '@/rdf/namespaces'
import { EntityConfig } from '@/entity/EntityConfig'

const catalogSpec = {
  name: 'catalog',
  targetClasses: [
    DCAT('Resource').value,
    DCAT('Catalog').value,
  ],
  children: {
    title: 'Datasets',
    name: 'dataset',
    relation: DCAT('dataset').value,
    tags: DCAT('theme').value,
    metadata: null,
  },
  hierarchy: ['repository'],
  links: null,
}

const catalogConfig = new EntityConfig(catalogSpec)

export default catalogConfig
