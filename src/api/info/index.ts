import request from '../request'

export default {
  getInfo() {
    return request.get('/actuator/info')
  },
}
