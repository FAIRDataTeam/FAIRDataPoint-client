import _ from 'lodash'
import repositoryConfig from '@/entity/RepositoryConfig'
import catalogConfig from '@/entity/CatalogConfig'
import datasetConfig from '@/entity/DatasetConfig'
import distributionConfig from '@/entity/DistributionConfig'

const entityConfigs = {
  repository: repositoryConfig,
  catalog: catalogConfig,
  dataset: datasetConfig,
  distribution: distributionConfig,
}

export function getConfigFor(entity) {
  return _.get(entityConfigs, entity)
}

export function getParentConfigFor(entity) {
  const { parentEntity } = getConfigFor(entity)
  return getConfigFor(parentEntity)
}
