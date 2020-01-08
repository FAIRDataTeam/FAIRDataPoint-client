import _ from 'lodash'
import axios from 'axios'

const request = axios.create({
  baseURL: _.get(window, 'config.publicPath', 'http://localhost:3000'),
  headers: {
    Accept: 'application/json',
  },
})

export default request
