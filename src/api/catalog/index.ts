import request from '../request'

export default {
  getCatalog(id) {
    return request.get(`/catalog/${id}`, {
      headers: {
        Accept: 'text/turtle',
      },
    })
  },

  getCatalogSpec() {
    return request.get('/catalog/spec', {
      headers: {
        Accept: 'text/turtle',
      },
    })
  },

  getCatalogMembership(id) {
    return request.get(`/catalog/${id}/member`)
  },

  putCatalog(id, data) {
    return request.put(`/catalog/${id}`, data, {
      headers: {
        Accept: 'text/turtle',
        'Content-Type': 'text/turtle',
      },
    })
  },

  deleteCatalog(id) {
    return request.delete(`/catalog/${id}`)
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
