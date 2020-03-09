import request from '../request'

export default {
  getRepository() {
    return request.get('/', {
      headers: {
        Accept: 'text/turtle',
      },
    })
  },

  getRepositorySpec() {
    return request.get('/spec', {
      headers: {
        Accept: 'text/turtle',
      },
    })
  },

  putRepository(data) {
    return request.put('/', data, {
      headers: {
        Accept: 'text/turtle',
        'Content-Type': 'text/turtle',
      },
    })
  },

  getRepositoryDashboard() {
    return request.get('/dashboard')
  },
}
