import request from '@/api/request'

export default {
  getEntries({
    state, permit, sort, page,
  }) {
    return request.get(`/index/entries?state=${state}&permit=${permit}&sort=${sort}&page=${page - 1}`)
  },

  getInfo() {
    return request.get('/index/entries/info')
  },

  getEntry(uuid) {
    return request.get(`/index/entries/${uuid}`)
  },

  putEntry(uuid, data) {
    return request.put(`/index/entries/${uuid}`, data)
  },

  deleteEntry(uuid) {
    return request.delete(`/index/entries/${uuid}`)
  },

  getSettings() {
    return request.get('/index/settings')
  },

  putSettings(settings) {
    return request.put('/index/settings', settings)
  },

  deleteSettings() {
    return request.delete('/index/settings')
  },

  ping(clientUrl) {
    return request.post('/index/admin/trigger', { clientUrl })
  },
}
