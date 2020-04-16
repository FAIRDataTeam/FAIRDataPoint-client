import { DCAT, R3D } from '@/rdf/namespaces'
import { EntityConfig } from '@/entity/EntityConfig'
import api from '@/api'
import Graph from '@/rdf/Graph'
import config from '@/config'


class RepositoryConfig extends EntityConfig {
  protected buildApi(): any {
    return api.repository
  }

  public subject(_entityId): string {
    return config.apiURL
  }

  public get viewActions() {
    return ['edit']
  }

  public canCreateChild(authenticated, _entity) {
    return authenticated
  }

  public createChildUrl(entityId): string {
    return `/create-${this.spec.children.name}`
  }

  public createBreadcrumbs(graph: Graph, entityId) {
    return []
  }
}


const repositorySpec = {
  name: 'repository',
  targetClasses: [
    DCAT('Resource').value,
    R3D('Repository').value,
  ],
  children: {
    title: 'Catalogs',
    name: 'catalog',
    relation: R3D('dataCatalog').value,
    tags: DCAT('themeTaxonomy').value,
    metadata: null,
  },
  hierarchy: [],
  links: null,
}

const repositoryConfig = new RepositoryConfig(repositorySpec)

export default repositoryConfig
