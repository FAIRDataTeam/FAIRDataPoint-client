import request from '../request'


export default {
  getApiKeys() {
    return request.get('/api-keys')
  },

  postApiKey(apiKey) {
    return request.post('/api-keys', apiKey)
  },

  deleteApiKey(apiKey) {
    return request.delete(`/api-keys/${apiKey.uuid}`)
  },
}
