import request from '../request'

export default {
  fetchToken(email: string, password: string) {
    return request.post('/tokens', { email, password })
  },
}
