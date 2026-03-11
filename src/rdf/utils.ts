import _ from 'lodash'

function pathTerm(path: string): string {
  return _.last(path.split(/[/#]/)) ?? ''
}

export default {
  pathTerm,
}
