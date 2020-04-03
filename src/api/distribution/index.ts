import request from '../request'

export default {
  getDistribution(id) {
    return request.get(`/distribution/${id}`, {
      headers: {
        Accept: 'text/turtle',
      },
    })
  },

  getDistributionSpec() {
    return request.get('/distribution/spec', {
      headers: {
        Accept: 'text/turtle',
      },
    })
  },

  getDistributionMembership(id) {
    return request.get(`/distribution/${id}/member`)
  },

  putDistribution(id, data) {
    return request.put(`/distribution/${id}`, data, {
      headers: {
        Accept: 'text/turtle',
        'Content-Type': 'text/turtle',
      },
    })
  },

  deleteDistribution(id) {
    return request.delete(`/distribution/${id}`)
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
