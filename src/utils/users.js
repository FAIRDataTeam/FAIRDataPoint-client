import _ from 'lodash'

export function sortUsers(users) {
  return _.orderBy(users, ['firstName', 'lastName'], ['asc'])
}

export function fullName(user) {
  return `${user.firstName} ${user.lastName}`
}
