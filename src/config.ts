import _ from 'lodash'

const publicPath = _.get(window, 'config.publicPath', '')
const apiURL = _.get(window, 'config.apiURL', `${window.location.protocol}//${window.location.host}${publicPath}`)
const isIndex = () => _.get(window, 'config.index', false)
const persistentURL = () => _.get(window, 'config.persistentURL', apiURL)
const dateFormat = 'DD-MM-Y'
const dateTimeFormat = 'DD-MM-Y, HH:mm:ss'

export default {
  apiURL,
  dateFormat,
  dateTimeFormat,
  isIndex,
  persistentURL,
  publicPath,
}
