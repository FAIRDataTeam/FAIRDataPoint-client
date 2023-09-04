import _ from 'lodash'
import { ChildSpec, EntityConfig } from '@/entity/EntityConfig'
import api from '@/api'
import Graph from '@/rdf/Graph'
import config from '@/config'

export class RepositoryConfig extends EntityConfig {
  public get isRepository() {
    return true
  }

  protected buildApi(): any {
    return api.repository
  }

  public subject(_entityId): string {
    return config.persistentURL()
  }

  public get viewActions() {
    return ['edit']
  }

  public canCreateChild(authenticated, _entity) {
    return authenticated
  }

  public createChildUrl(child: ChildSpec, _entityId): string {
    return `/create-${this.getChildUrlPrefix(child)}`
  }

  public createBreadcrumbs(_graph: Graph, _entityId) {
    return []
  }
}
