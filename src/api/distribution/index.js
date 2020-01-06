import request from '../request'

export default {
  getDistributionSpec() {
    return request.get('/distribution/spec')
  },

  getDistribution(id) {
    return request.get(`/distribution/${id}`)
  },

  putDistribution(id, data) {
    return request.put(`/distribution/${id}`, data)
  },

  getDistributionMembers(id) {
    return request.get(`/distribution/${id}/members`)
  },

  putDistributionMember(distributionId, userUuid, membershipUuid) {
    return request.put(`/distribution/${distributionId}/members/${userUuid}`, {
      membershipUuid,
    })
  },

  deleteDistributionMember(distributionId, userUuid) {
    return request.delete(`/distribution/${distributionId}/members/${userUuid}`)
  },
}
