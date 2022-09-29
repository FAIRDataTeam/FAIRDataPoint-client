import request from '@/api/request'

export default {
  postAutoComplete(rdfType, query) {
    return request.post('/forms/autocomplete', { rdfType, query })
  },
}
