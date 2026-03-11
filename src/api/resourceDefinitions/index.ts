import request from '../request'

export default {
  getResourceDefinitions() {
    return request.get('/resource-definitions')
  },

  getResourceDefinition(id: string) {
    return request.get(`/resource-definitions/${id}`)
  },

  postResourceDefinition(resourceDefinition: Record<string, unknown>) {
    return request.post('/resource-definitions', resourceDefinition)
  },

  putResourceDefinition(resourceDefinition: { uuid: string } & Record<string, unknown>) {
    return request.put(`/resource-definitions/${resourceDefinition.uuid}`, resourceDefinition)
  },

  deleteResourceDefinition(resourceDefinition: { uuid: string }) {
    return request.delete(`/resource-definitions/${resourceDefinition.uuid}`)
  },
}
