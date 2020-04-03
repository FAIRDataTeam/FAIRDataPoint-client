import request from '../request'

export default {
  getDataset(id) {
    return request.get(`/dataset/${id}`, {
      headers: {
        Accept: 'text/turtle',
      },
    })
  },

  getDatasetSpec() {
    return request.get('/dataset/spec', {
      headers: {
        Accept: 'text/turtle',
      },
    })
  },

  getDatasetMembership(id) {
    return request.get(`/dataset/${id}/member`)
  },

  putDataset(id, data) {
    return request.put(`/dataset/${id}`, data, {
      headers: {
        Accept: 'text/turtle',
        'Content-Type': 'text/turtle',
      },
    })
  },

  deleteDataset(id) {
    return request.delete(`/dataset/${id}`)
  },

  getDatasetMembers(id) {
    return request.get(`/dataset/${id}/members`)
  },

  putDatasetMember(datasetId, userUuid, membershipUuid) {
    return request.put(`/dataset/${datasetId}/members/${userUuid}`, {
      membershipUuid,
    })
  },

  deleteDatasetMember(datasetId, userUuid) {
    return request.delete(`/dataset/${datasetId}/members/${userUuid}`)
  },
}
