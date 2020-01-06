import request from '../request'

export default {
  getCatalogSpec() {
    return request.get('/catalog/spec')
  },

  getCatalog(id) {
    return request.get(`/catalog/${id}`)
  },

  putCatalog(id, data) {
    return request.put(`/catalog/${id}`, data)
  },

  getCatalogMembers(id) {
    return request.get(`/catalog/${id}/members`)
  },

  putCatalogMember(id, userUuid, membershipUuid) {
    return request.put(`/catalog/${id}/members/${userUuid}`, {
      membershipUuid,
    })
  },

  deleteCatalogMember(id, userUuid) {
    return request.delete(`/catalog/${id}/members/${userUuid}`)
  },
}
