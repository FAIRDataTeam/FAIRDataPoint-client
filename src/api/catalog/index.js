import request from '../request'

export default {
  getCatalogSpec() {
    return request.get('/fdp/catalog/spec')
  },

  getCatalog(id) {
    return request.get(`/fdp/catalog/${id}`)
  },

  putCatalog(id, data) {
    return request.put(`/fdp/catalog/${id}`, data)
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
}
