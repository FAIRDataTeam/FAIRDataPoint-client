import config from '@/config'
import request from './request'

const createRequestInterceptor = (store) => {
  request.interceptors.request.use((oldConfig) => {
    const newConfig = { ...oldConfig }

    const token = store.getters['auth/token']
    if (token) {
      newConfig.headers.Authorization = `Bearer ${token}`
    }

    return newConfig
  }, null)
}

const createResponseInterceptor = (store) => {
  request.interceptors.response.use(null, async (error) => {
    const { status } = error.response
    if (status === 401 && !error.request.responseURL.endsWith('/tokens')) {
      await store.dispatch('auth/logout')
      window.location.href = `${config.publicPath}/login`
    } else {
      throw error
    }
  })
}

const plugin = (store) => {
  createRequestInterceptor(store)
  createResponseInterceptor(store)
}

export default plugin
