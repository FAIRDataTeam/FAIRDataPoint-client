import axios from 'axios'
import config from '@/config'

const request = axios.create({
  baseURL: config.apiURL,
  headers: {
    Accept: 'application/json',
  },
})

export default request
