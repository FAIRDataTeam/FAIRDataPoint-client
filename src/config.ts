import _ from 'lodash'

const baseURL = _.get(window, 'config.publicPath', 'http://localhost:3000')
const dateFormat = 'DD-MM-Y'

export default {
  baseURL,
  dateFormat,
}
