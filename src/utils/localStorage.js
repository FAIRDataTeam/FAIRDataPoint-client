import _ from 'lodash'

const sessionKey = 'session'

export function saveSession(session) {
  localStorage.setItem(sessionKey, JSON.stringify(session))
}

export function getSession() {
  const session = localStorage.getItem(sessionKey)
  return session !== null ? JSON.parse(session) : null
}

export function clearSession() {
  localStorage.removeItem(sessionKey)
}

export function getUserToken() {
  return _.get(getSession(), 'token')
}
