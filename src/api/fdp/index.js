import request from '../request'

export default {
  getFdpSpec() {
    return request.get('/fdp/spec')
  },

  getFdp() {
    return request.get('/fdp')
  },

  putFdp(data) {
    return request.put('/fdp', data)
  },

  getFdpDashboard() {
    return request.get('/fdp/dashboard')
  },
}
