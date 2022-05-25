import request from '../request'

export default {
  search({ q }) {
    return request.post('/search', { q })
  },

  getQuery() {
    return request.get('/search/query')
  },

  postQuery(data) {
    return request.post('/search/query', data)
  },

  getFilters() {
    return request.get('/search/filters')
  },
}
