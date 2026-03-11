import _ from 'lodash'

type Permission = {
  code?: string
}

function hasPermission(entity: Record<string, any> | null, perm: string) {
  const memberships = _.get(entity, 'member.membership.permissions', []) as Permission[]
  return memberships.some((p) => p.code === perm)
}

function hasWrite(entity: Record<string, any> | null) {
  return hasPermission(entity, 'W')
}

function hasCreate(entity: Record<string, any> | null) {
  return hasPermission(entity, 'C')
}

export default {
  hasWrite,
  hasCreate,
}
