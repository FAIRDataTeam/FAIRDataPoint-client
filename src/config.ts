import _ from 'lodash'

const publicPath = _.get(window, 'config.publicPath', '')
const clientURL = `${window.location.protocol}//${window.location.host}${publicPath}`
const apiURL = _.get(window, 'config.apiURL', clientURL)
const isIndex = () => _.get(window, 'config.index', false)
const persistentURL = () => _.get(window, 'config.persistentURL', apiURL)
const dateFormat = 'DD-MM-Y'
const dateTimeFormat = 'DD-MM-Y, HH:mm:ss'
const defaultPageSize = 5

export default {
  apiURL,
  clientURL,
  dateFormat,
  dateTimeFormat,
  defaultPageSize,
  isIndex,
  persistentURL,
  publicPath,
}
