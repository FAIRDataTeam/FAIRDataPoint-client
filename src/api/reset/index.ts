import request from '../request'

export type ResetPayload = {
  users: boolean,
  metadata: boolean,
  resourceDefinitions: boolean,
  settings: boolean,
}

export default {
  postReset(reset: ResetPayload) {
    return request.post('/reset', reset)
  },
}
