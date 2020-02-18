import _ from 'lodash'


export default class Status {
  static readonly PENDING = 'PENDING'

  static readonly ERROR = 'ERROR'

  static readonly SUCCESS = 'SUCCESS'

  static readonly DEFAULT = 'DEFAULT'

  status: string

  msg?: string

  constructor() {
    this.clear()
  }

  setStatus(status: string, msg?: string): void {
    this.status = status
    this.msg = msg
  }

  get message(): string | null {
    return this.msg
  }

  isPending(): boolean {
    return this.status === Status.PENDING
  }

  isDefault(): boolean {
    return this.status === Status.DEFAULT
  }

  isError(): boolean {
    return this.status === Status.ERROR
  }

  isSuccess(): boolean {
    return this.status === Status.SUCCESS
  }

  setPending(): void {
    this.clear()
    this.status = Status.PENDING
  }

  setError(msg?: string): void {
    this.status = Status.ERROR
    this.msg = msg
  }

  setErrorFromResponse(error: any, defaultMsg: string): void {
    this.status = Status.ERROR
    this.msg = _.get(error, 'response.data.message', defaultMsg)
  }

  setDone(msg?: string): void {
    this.msg = msg
    this.status = msg ? Status.SUCCESS : Status.DEFAULT
  }

  clear(): void {
    this.status = Status.DEFAULT
    this.msg = null
  }
}
