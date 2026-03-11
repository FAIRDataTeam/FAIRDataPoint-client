import request from '../request'

export default {
  search({ q }: { q: string }) {
    return request.post('/search', { query: q })
  },

  getQuery() {
    return request.get('/search/query')
  },

  postQuery(data: Record<string, unknown>) {
    return request.post('/search/query', data)
  },

  getFilters() {
    return request.get('/search/filters')
  },

  getSavedQueries() {
    return request.get('/search/query/saved')
  },

  postSavedQuery(data: Record<string, unknown>) {
    return request.post('/search/query/saved', data)
  },

  deleteSavedQuery(uuid: string) {
    return request.delete(`/search/query/saved/${uuid}`)
  },
}
