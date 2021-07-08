import request from '../request'

export default {
  get() {
    return request.get('/settings')
  },

  put(settings) {
    return request.put('/settings', settings)
  },
}
