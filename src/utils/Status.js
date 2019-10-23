const PENDING = 'LOADING'
const ERROR = 'ERROR'
const SUCCESS = 'SUCCESS'
const DEFAULT = 'DEFAULT'


export default class Status {
  constructor() {
    this.clear()
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

  get errorMsg() {
    return this.msgError
  }

  get successMsg() {
    return this.msgSuccess
  }

  setPending() {
    this.clear()
    this.status = PENDING
  }

  setError(msg) {
    this.status = ERROR
    this.msgError = msg
  }

  setDone(msg) {
    this.msgSuccess = msg
    this.status = msg ? SUCCESS : DEFAULT
  }

  clear() {
    this.status = DEFAULT
    this.msgError = null
    this.msgSuccess = null
  }
}
