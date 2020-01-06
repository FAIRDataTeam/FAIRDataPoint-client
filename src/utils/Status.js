import _ from 'lodash'

const PENDING = 'LOADING'
const ERROR = 'ERROR'
const SUCCESS = 'SUCCESS'
const DEFAULT = 'DEFAULT'


export default class Status {
  constructor() {
    this.clear()
  }

  setStatus(status, msg) {
    this.status = status
    this.msg = msg
  }

  get message() {
    return this.msg
  }

  isPending() {
    return this.status === PENDING
  }

  isDefault() {
    return this.status === DEFAULT
  }

  isError() {
    return this.status === ERROR
  }

  isSuccess() {
    return this.status === SUCCESS
  }

  setPending() {
    this.clear()
    this.status = PENDING
  }

  setError(msg) {
    this.status = ERROR
    this.msg = msg
  }

  setErrorFromResponse(error, defaultMsg) {
    this.status = ERROR
    this.msg = _.get(error, 'response.data.message', defaultMsg)
  }

  setDone(msg) {
    this.msg = msg
    this.status = msg ? SUCCESS : DEFAULT
  }

  clear() {
    this.status = DEFAULT
    this.msg = null
  }
}

Status.PENDING = PENDING
Status.ERROR = ERROR
Status.SUCCESS = SUCCESS
Status.DEFAULT = DEFAULT
