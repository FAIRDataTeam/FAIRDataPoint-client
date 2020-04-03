import request from '@/api/request'

function build(entity) {
  return {
    get(id) {
      return request.get(`/${entity}/${id}`, {
        headers: {
          Accept: 'text/turtle',
        },
      })
    },

    getSpec() {
      return request.get(`/${entity}/spec`, {
        headers: {
          Accept: 'text/turtle',
        },
      })
    },

    getMembership(id) {
      return request.get(`/${entity}/${id}/member`)
    },

    put(id, data) {
      return request.put(`/${entity}/${id}`, data, {
        headers: {
          Accept: 'text/turtle',
          'Content-Type': 'text/turtle',
        },
      })
    },

    delete(id) {
      return request.delete(`/${entity}/${id}`)
    },

    getMembers(id) {
      return request.get(`/${entity}/${id}/members`)
    },

    putMember(id, userUuid, membershipUuid) {
      return request.put(`/${entity}/${id}/members/${userUuid}`, {
        membershipUuid,
      })
    },

    deleteMember(id, userUuid) {
      return request.delete(`/${entity}/${id}/members/${userUuid}`)
    },
  }
}

export default {
  build,
}
