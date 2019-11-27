const sessionKey = `${window.config.publicPath}/session`

function saveSession(session) {
  localStorage.setItem(sessionKey, JSON.stringify(session))
}

function getSession() {
  const session = localStorage.getItem(sessionKey)
  return session !== null ? JSON.parse(session) : null
}

function clearSession() {
  localStorage.removeItem(sessionKey)
}

export default {
  saveSession,
  getSession,
  clearSession,
}
