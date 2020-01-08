import request from '../request'

export default {
  getDatasetSpec() {
    return request.get('/dataset/spec')
  },

  getDataset(id) {
    return request.get(`/dataset/${id}`)
  },

  putDataset(id, data) {
    return request.put(`/dataset/${id}`, data)
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
