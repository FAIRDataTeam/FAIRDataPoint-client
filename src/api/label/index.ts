import request from '../request'

export default {
  getLabel(url) {
    return request.get(`/label?iri=${encodeURIComponent(url)}`)
  },
}
