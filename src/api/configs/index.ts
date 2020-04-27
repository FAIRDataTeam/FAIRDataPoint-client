import request from '../request'

export default {
  getBootstrap() {
    return request.get('/configs/bootstrap')
  },
}
