import request from '../request'

export default {
  search({ q }) {
    return request.post('/search', { q })
  },
}
