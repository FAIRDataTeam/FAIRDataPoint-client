import _ from 'lodash'

function hasPermission(entity, perm) {
  const memberships = _.get(entity, 'membership.permissions', [])
  return memberships.filter(p => p.code === perm).length > 0
}

export function hasWrite(entity) {
  return hasPermission(entity, 'W')
}

export function hasCreate(entity) {
  return hasPermission(entity, 'C')
}
