import _ from 'lodash'

function hasPermission(entity, perm) {
  const memberships = _.get(entity, 'member.membership.permissions', [])
  return memberships.filter(p => p.code === perm).length > 0
}

function hasWrite(entity) {
  return hasPermission(entity, 'W')
}

function hasCreate(entity) {
  return hasPermission(entity, 'C')
}

export default {
  hasWrite,
  hasCreate,
}
