import axios from 'axios'

const request = axios.create({
  baseURL: typeof window.config.publicPath !== 'undefined' ? window.config.publicPath : 'http://localhost:3000',
  headers: {
    Accept: 'application/json',
  },
})

export default request
