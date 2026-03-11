import request from '../request'

export default {
  getUsers() {
    return request.get('/users')
  },

  getUser(id: string) {
    return request.get(`/users/${id}`)
  },

  getUserCurrent() {
    return request.get('/users/current')
  },

  postUser(user: Record<string, unknown>) {
    return request.post('/users', user)
  },

  putUser(userUuid: string, user: Record<string, unknown>) {
    return request.put(`/users/${userUuid}`, user)
  },

  deleteUser(user: { uuid: string }) {
    return request.delete(`/users/${user.uuid}`)
  },

  putUserPassword(userUuid: string, password: string) {
    return request.put(`/users/${userUuid}/password`, { password })
  },
}
