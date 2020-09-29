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

  putUser(userUuid, user) {
    return request.put(`/users/${userUuid}`, user)
  },

  deleteUser(user) {
    return request.delete(`/users/${user.uuid}`)
  },

  putUserPassword(userUuid, password) {
    return request.put(`/users/${userUuid}/password`, { password })
  },
}
