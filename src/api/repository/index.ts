import request from '../request'

export default {
  get() {
    return request.get('/', {
      headers: {
        Accept: 'text/turtle',
      },
    })
  },

  getExpanded() {
    return request.get('/expanded', {
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

  getMeta() {
    return request.get('/meta')
  },

  getDashboard() {
    return request.get('/dashboard')
  },
}
