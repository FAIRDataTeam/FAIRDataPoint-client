import request from '../request'

export default {
  getProfile(id) {
    return request.get(`/profile/${id}`, {
      headers: {
        Accept: 'text/turtle',
      },
    })
  },
}
