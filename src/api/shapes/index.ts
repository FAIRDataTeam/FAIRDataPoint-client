import request from '../request'


export default {
  getShapes() {
    return request.get('/shapes')
  },

  getShape(id) {
    return request.get(`/shapes/${id}`)
  },

  postShape(shape) {
    return request.post('/shapes', shape)
  },

  putShape(shape) {
    return request.put(`/shapes/${shape.uuid}`, shape)
  },

  deleteShape(shape) {
    return request.delete(`/shapes/${shape.uuid}`)
  },

  getImport(fdpUrl) {
    return request.get(`/shapes/import?from=${fdpUrl}`)
  },

  postImport(shapes) {
    return request.post('/shapes/import', shapes)
  },
}
