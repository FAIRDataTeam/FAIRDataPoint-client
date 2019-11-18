import request from './request'


const createRequestInterceptor = (store) => {
  request.interceptors.request.use((oldConfig) => {
    const config = { ...oldConfig }

    const token = store.getters['auth/token']
    if (token) {
      config.headers.common.Authorization = `Bearer ${token}`
    }

    return config
  }, null)
}


const createResponseInterceptor = (store) => {
  request.interceptors.response.use(null, async (error) => {
    const { status } = error.response
    if (status === 401) {
      store.dispatch('auth/logout')
    }
  })
}


const plugin = (store) => {
  createRequestInterceptor(store)
  createResponseInterceptor(store)
}

export default plugin
