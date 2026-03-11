import request from '../request'

export default {
  get() {
    return request.get('/settings')
  },

  put(settings: Record<string, unknown>) {
    return request.put('/settings', settings)
  },
}
