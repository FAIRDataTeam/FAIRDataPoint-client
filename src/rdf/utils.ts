import _ from 'lodash'
import config from '@/config'

function pathTerm(path: string): string {
  return _.last(path.split(/[/#]/))
}


function repositorySubject(): string {
  return config.baseURL
}


function catalogSubject(catalogId: string): string {
  return `${config.baseURL}/catalog/${catalogId}`
}


function datasetSubject(datasetId: string): string {
  return `${config.baseURL}/dataset/${datasetId}`
}


function distributionSubject(distributionId: string): string {
  return `${config.baseURL}/distribution/${distributionId}`
}


export default {
  pathTerm,
  repositorySubject,
  catalogSubject,
  datasetSubject,
  distributionSubject,
}
