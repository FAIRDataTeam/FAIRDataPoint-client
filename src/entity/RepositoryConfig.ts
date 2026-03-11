import { ChildSpec, EntityConfig } from '@/entity/EntityConfig'
import { BreadcrumbItem } from '@/utils/breadcrumbs'
import api from '@/api'
import config from '@/config'

export class RepositoryConfig extends EntityConfig {
  public get isRepository() {
    return true
  }

  protected buildApi(): any {
    return api.repository
  }

  public subject(_entityId: string | null): string {
    return config.persistentURL()
  }

  public get viewActions() {
    return ['edit']
  }

  public canCreateChild(authenticated: boolean, _entity: unknown) {
    return authenticated
  }

  public createChildUrl(child: ChildSpec, _entityId: string | null): string {
    return `/create-${this.getChildUrlPrefix(child)}`
  }

  public createBreadcrumbs(
    _path: Record<string, any>,
    _entityIri: string | null,
  ): BreadcrumbItem[] {
    return []
  }
}
