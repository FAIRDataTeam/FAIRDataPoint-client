import request from '../request'

export default {
  getLabel(url: string) {
    return request.get(`/label?iri=${encodeURIComponent(url)}`)
  },
}
