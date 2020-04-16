import { DCAT } from '@/rdf/namespaces'
import { EntityConfig } from '@/entity/EntityConfig'

const datasetSpec = {
  name: 'dataset',
  targetClasses: [
    DCAT('Resource').value,
    DCAT('Dataset').value,
  ],
  children: {
    title: 'Distributions',
    name: 'distribution',
    relation: DCAT('distribution').value,
    tags: null,
    metadata: [{
      label: 'Media Type',
      property: DCAT('mediaType').value,
    }],
  },
  hierarchy: [
    'repository',
    'catalog',
  ],
  links: null,
}

const datasetConfig = new EntityConfig(datasetSpec)

export default datasetConfig
