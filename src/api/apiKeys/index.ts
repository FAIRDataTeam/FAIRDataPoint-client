import request from '../request'

export default {
  getApiKeys() {
    return request.get('/api-keys')
  },

  postApiKey(apiKey: Record<string, unknown> = {}) {
    return request.post('/api-keys', apiKey)
  },

  deleteApiKey(apiKey: { uuid: string }) {
    return request.delete(`/api-keys/${apiKey.uuid}`)
  },
}
