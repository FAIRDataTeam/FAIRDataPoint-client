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

    getExpanded(id) {
      return request.get(`/${entity}/${id}/expanded`, {
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

    post(data) {
      return request.post(`/${entity}`, data, {
        headers: {
          Accept: 'text/turtle',
          'Content-Type': 'text/turtle',
        },
      })
    },

    put(id, data) {
      return request.put(`/${entity}/${id}`, data, {
        headers: {
          Accept: 'text/turtle',
          'Content-Type': 'text/turtle',
        },
      })
    },

    getMeta(id) {
      return request.get(`/${entity}/${id}/meta`)
    },

    putMetaState(id, data) {
      return request.put(`/${entity}/${id}/meta/state`, data)
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
