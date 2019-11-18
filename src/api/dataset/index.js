import request from '../request'

export default {
  getDatasetSpec() {
    return request.get('/fdp/dataset/spec')
  },

  getDataset(id) {
    return request.get(`/fdp/dataset/${id}`)
  },

  putDataset(id, data) {
    return request.put(`/fdp/dataset/${id}`, data)
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
}
