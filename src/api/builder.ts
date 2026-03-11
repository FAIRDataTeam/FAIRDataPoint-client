import config from '@/config'
import request from '@/api/request'

function build(entity: string) {
  return {
    get(id: any) {
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

    getChildren(id: any, child: string, page: number) {
      return request.get(`/${entity}/${id}/page/${child}?page=${page}&size=${config.defaultPageSize}`, {
        headers: {
          Accept: 'text/turtle',
        },
      })
    },

    post(data: string) {
      return request.post(`/${entity}`, data, {
        headers: {
          Accept: 'text/turtle',
          'Content-Type': 'text/turtle',
        },
      })
    },

    put(id: any, data: string) {
      return request.put(`/${entity}/${id}`, data, {
        headers: {
          Accept: 'text/turtle',
          'Content-Type': 'text/turtle',
        },
      })
    },

    getMeta(id: any) {
      return request.get(`/${entity}/${id}/meta`)
    },

    putMetaState(id: any, data: Record<string, unknown>) {
      return request.put(`/${entity}/${id}/meta/state`, data)
    },

    delete(id: any) {
      return request.delete(`/${entity}/${id}`)
    },

    getMembers(id: any) {
      return request.get(`/${entity}/${id}/members`)
    },

    putMember(id: any, userUuid: string, membershipUuid: string) {
      return request.put(`/${entity}/${id}/members/${userUuid}`, {
        membershipUuid,
      })
    },

    deleteMember(id: any, userUuid: string) {
      return request.delete(`/${entity}/${id}/members/${userUuid}`)
    },
  }
}

export default {
  build,
}
