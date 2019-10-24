const authTokenKey = 'authToken'

export function getUserToken() {
  return localStorage.getItem(authTokenKey)
}

export function setUserToken(token) {
  localStorage.setItem(authTokenKey, token)
}

export function clearUserToken() {
  localStorage.removeItem(authTokenKey)
}
