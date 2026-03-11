// import _ from 'lodash'
// import repositorySpec from '@/entity/RepositorySpec'
// import catalogSpec from '@/entity/CatalogSpec'
// import datasetSpec from '@/entity/DatasetSpec'
// import distributionSpec from '@/entity/DistributionSpec'
import { EntityConfig, EntitySpec } from '@/entity/EntityConfig'
import { RepositoryConfig } from '@/entity/RepositoryConfig'

// const entitySpecs = {
//   [repositorySpec.uuid]: repositorySpec,
//   [catalogSpec.uuid]: catalogSpec,
//   [datasetSpec.uuid]: datasetSpec,
//   [distributionSpec.uuid]: distributionSpec,
// }
//
// const entityConfigs = {}
//
// // function initEntityConfigs() {
// Object.values<EntitySpec>(entitySpecs).forEach((spec) => {
//   const constructor = spec.parent ? EntityConfig : RepositoryConfig
//   entityConfigs[spec.urlPrefix] = new constructor(spec, entitySpecs)
// })
// // }
//
//
// export function getConfigFor(entity) {
//   return _.get(entityConfigs, entity)
// }
//
// export function getParentConfigFor(entity) {
//   const { parentEntity } = getConfigFor(entity)
//   return getConfigFor(parentEntity)
// }

export function createEntityConfigs(specs: EntitySpec[]): Record<string, EntityConfig> {
  const specsByUuid = specs.reduce<Record<string, EntitySpec>>((acc, spec) => {
    acc[spec.uuid] = spec
    return acc
  }, {})

  return specs.reduce<Record<string, EntityConfig>>((acc, spec) => {
    const Config = spec.urlPrefix.length > 0 ? EntityConfig : RepositoryConfig
    acc[spec.urlPrefix] = new Config(spec, specsByUuid)
    return acc
  }, {})
}
