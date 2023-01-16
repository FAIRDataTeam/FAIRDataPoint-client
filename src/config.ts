import _ from 'lodash'

const publicPath = _.get(window, 'config.publicPath', '')
const clientURL = `${window.location.protocol}//${window.location.host}${publicPath}`
const apiURL = _.get(window, 'config.apiURL', clientURL)
const appTitle = () => _.get(window, 'config.appTitle', 'FAIR Data Point')
const appTitleShort = () => _.get(window, 'config.appTitle', 'FDP')
const appSubtitle = () => _.get(window, 'config.appSubtitle', 'Metadata for machines')
const isIndex = () => _.get(window, 'config.index', false)
const persistentURL = () => _.get(window, 'config.persistentURL', apiURL)
const dateFormat = 'DD-MM-Y'
const dateTimeFormat = 'DD-MM-Y, HH:mm:ss'
const defaultPageSize = 5

export default {
  apiURL,
  appSubtitle,
  appTitle,
  appTitleShort,
  clientURL,
  dateFormat,
  dateTimeFormat,
  defaultPageSize,
  isIndex,
  persistentURL,
  publicPath,
}
