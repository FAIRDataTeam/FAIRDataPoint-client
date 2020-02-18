import request from '../request'

export default {
  getRepositorySpec() {
    return request.get('/spec')
  },

  getRepository() {
    return request.get('/')
  },

  putRepository(data) {
    return request.put('/', data)
  },

  getRepositoryDashboard() {
    return request.get('/dashboard')
  },
}
