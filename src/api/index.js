import request from './request'

export default {
  fetchToken(email, password) {
    return request.post('/tokens', { email, password })
  },

  getFdp() {
    return request.get('/fdp')
  },

  getCatalog(id) {
    return request.get(`/fdp/catalog/${id}`)
  },

  getCatalogMembers(id) {
    return request.get(`/fdp/catalog/${id}/members`)
  },

  putCatalogMember(id, userUuid, membershipUuid) {
    return request.put(`/fdp/catalog/${id}/members/${userUuid}`, {
      membershipUuid,
    })
  },

  deleteCatalogMember(id, userUuid) {
    return request.delete(`/fdp/catalog/${id}/members/${userUuid}`)
  },

  getDataset(id) {
    return request.get(`/fdp/dataset/${id}`)
  },

  getDatasetMembers(id) {
    return request.get(`/fdp/dataset/${id}/members`)
  },

  putDatasetMember(datasetId, userUuid, membershipUuid) {
    return request.put(`/fdp/dataset/${datasetId}/members/${userUuid}`, {
      membershipUuid,
    })
  },

  deleteDatasetMember(datasetId, userUuid) {
    return request.delete(`/fdp/dataset/${datasetId}/members/${userUuid}`)
  },

  getDistribution(id) {
    return request.get(`/fdp/distribution/${id}`)
  },

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

  getMemberships() {
    return request.get('/memberships')
  },

  getDashboard() {
    return request.get('/fdp/dashboard')
  },
}
