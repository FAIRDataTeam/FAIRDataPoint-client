import request from '../request'

export default {
  get() {
    return request.get('/', {
      headers: {
        Accept: 'text/turtle',
      },
    })
  },

  getSpec() {
    return request.get('/spec', {
      headers: {
        Accept: 'text/turtle',
      },
    })
  },

  put(_id, data) {
    return request.put('/', data, {
      headers: {
        Accept: 'text/turtle',
        'Content-Type': 'text/turtle',
      },
    })
  },

  delete() {
    return request.delete('/')
  },

  getMembership() {
    return Promise.resolve({ data: {} })
  },

  getDashboard() {
    return request.get('/dashboard')
  },
}
