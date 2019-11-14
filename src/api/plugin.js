import request from './request'


const createRequestInterceptor = (store) => {
  request.interceptors.request.use((oldConfig) => {
    const config = { ...oldConfig }
    config.headers.common.Accept = 'application/json'

    const token = store.getters['auth/token']
    if (token) {
      config.headers.common.Authorization = `Bearer ${token}`
    }

    return config
  }, null)
}


const plugin = (store) => {
  createRequestInterceptor(store)
}

export default plugin
