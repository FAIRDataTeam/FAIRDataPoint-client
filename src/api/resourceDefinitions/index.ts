import request from '../request'


export default {
  getResourceDefinitions() {
    return request.get('/resource-definitions')
  },

  getResourceDefinition(id) {
    return request.get(`/resource-definitions/${id}`)
  },

  postResourceDefinition(resourceDefinition) {
    return request.post('/resource-definitions', resourceDefinition)
  },

  putResourceDefinition(resourceDefinition) {
    return request.put(`/resource-definitions/${resourceDefinition.uuid}`, resourceDefinition)
  },

  deleteResourceDefinition(resourceDefinition) {
    return request.delete(`/resource-definitions/${resourceDefinition.uuid}`)
  },
}
