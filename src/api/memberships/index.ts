import request from '../request'

export default {
  getMemberships() {
    return request.get('/memberships')
  },
}
