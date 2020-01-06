import request from '../request'

export default {
  getUsers() {
    return request.get('/users')
  },

  getUser(id) {
    return request.get(`/users/${id}`)
  },

  getUserCurrent() {
    return request.get('/users/current')
  },

  postUser(user) {
    return request.post('/users', user)
  },

  putUser(user) {
    return request.put(`/users/${user.uuid}`, user)
  },

  deleteUser(user) {
    return request.delete(`/users/${user.uuid}`)
  },

  putUserPassword(user, password) {
    return request.put(`/users/${user.uuid}/password`, { password })
  },
}
