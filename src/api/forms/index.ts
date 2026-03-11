import request from '@/api/request'

export default {
  postAutoComplete(rdfType: string, query: string) {
    return request.post('/forms/autocomplete', { rdfType, query })
  },
}
