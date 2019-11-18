import request from '../request'

export default {
  getDistributionSpec() {
    return request.get('/fdp/distribution/spec')
  },

  getDistribution(id) {
    return request.get(`/fdp/distribution/${id}`)
  },

  putDistribution(id, data) {
    return request.put(`/fdp/distribution/${id}`, data)
  },

  getDistributionMembers(id) {
    return request.get(`/fdp/distribution/${id}/members`)
  },

  putDistributionMember(distributionId, userUuid, membershipUuid) {
    return request.put(`/fdp/distribution/${distributionId}/members/${userUuid}`, {
      membershipUuid,
    })
  },

  deleteDistributionMember(distributionId, userUuid) {
    return request.delete(`/fdp/distribution/${distributionId}/members/${userUuid}`)
  },
}
