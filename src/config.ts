import _ from 'lodash'

const publicPath = _.get(window, 'config.publicPath', '')
const apiURL = _.get(window, 'config.apiURL', `${window.location.protocol}//${window.location.host}${publicPath}`)
const dateFormat = 'DD-MM-Y'

export default {
  apiURL,
  dateFormat,
}
