import request from '@/api/request'

export default {
  getEntries({ state, sort, page }) {
    return request.get(`/index/entries?state=${state}&sort=${sort}&page=${page - 1}`)
  },
  getInfo() {
    return request.get('/index/entries/info')
  },

  getEntry(uuid) {
    return request.get(`/index/entries/${uuid}`)
  },
}
