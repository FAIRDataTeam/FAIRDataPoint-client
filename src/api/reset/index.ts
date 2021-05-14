import request from '../request'


export default {
  postReset(reset) {
    return request.post('/reset', reset)
  },
}
