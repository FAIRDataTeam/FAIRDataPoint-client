import request from '@/api/request'

export default {
  getEntries({
    state, permit, sort, page,
  }: {
    state: string
    permit: string
    sort: string
    page: number
  }) {
    return request.get(`/index/entries?state=${state}&permit=${permit}&sort=${sort}&page=${page - 1}`)
  },

  getInfo() {
    return request.get('/index/entries/info')
  },

  getEntry(uuid: string) {
    return request.get(`/index/entries/${uuid}`)
  },

  putEntry(uuid: string, data: Record<string, unknown>) {
    return request.put(`/index/entries/${uuid}`, data)
  },

  deleteEntry(uuid: string) {
    return request.delete(`/index/entries/${uuid}`)
  },

  getSettings() {
    return request.get('/index/settings')
  },

  putSettings(settings: Record<string, unknown>) {
    return request.put('/index/settings', settings)
  },

  deleteSettings() {
    return request.delete('/index/settings')
  },

  ping(clientUrl: string) {
    return request.post('/index/admin/trigger', { clientUrl })
  },
}
