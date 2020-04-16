import { DCAT } from '@/rdf/namespaces'
import { EntityConfig } from '@/entity/EntityConfig'

const distributionSpec = {
  name: 'distribution',
  targetClasses: [
    DCAT('Resource').value,
    DCAT('Distribution').value,
  ],
  children: null,
  hierarchy: [
    'repository',
    'catalog',
    'dataset',
  ],
  links: [{
    label: 'Access online',
    relation: DCAT('accessURL').value,
    icon: ['fas', 'external-link-alt'],
  }, {
    label: 'Download',
    relation: DCAT('downloadURL').value,
    icon: ['fas', 'download'],
  }],
}

const distributionConfig = new EntityConfig(distributionSpec)

export default distributionConfig
