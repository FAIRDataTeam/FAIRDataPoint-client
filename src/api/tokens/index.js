import request from '../request'

export default {
  fetchToken(email, password) {
    return request.post('/tokens', { email, password })
  },
}
