import request from '../request'
import config from '@/config'

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

  getChildren(_id, child, page) {
    return request.get(`/page/${child}?page=${page}&size=${config.defaultPageSize}`, {
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
