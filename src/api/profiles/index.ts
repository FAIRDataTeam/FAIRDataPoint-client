import request from '../request'

export default {
  getProfile(id: string) {
    return request.get(`/profile/${id}`, {
      headers: {
        Accept: 'text/turtle',
      },
    })
  },
}
