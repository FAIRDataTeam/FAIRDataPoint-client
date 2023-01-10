import request from '../request'

export default {
  getAll() {
    return request.get('/metadata-schemas?drafts=true')
  },

  getForExtend() {
    return request.get('/metadata-schemas?drafts=false')
  },

  getForResource() {
    return request.get('/metadata-schemas?drafts=false&abstract=false')
  },

  get(uuid) {
    return request.get(`/metadata-schemas/${uuid}`)
  },

  getDraft(uuid) {
    return request.get(`/metadata-schemas/${uuid}/draft`)
  },

  post(schema) {
    return request.post('/metadata-schemas', schema)
  },

  putDraft(schema) {
    return request.put(`/metadata-schemas/${schema.uuid}/draft`, schema)
  },

  postVersion(schema, version) {
    return request.post(`/metadata-schemas/${schema.uuid}/versions`, version)
  },

  delete(uuid) {
    return request.delete(`/metadata-schemas/${uuid}`)
  },

  getImport(url) {
    return request.get(`/metadata-schemas/import?from=${encodeURIComponent(url)}`)
  },

  getUpdate() {
    return request.get('/metadata-schemas/updates')
  },

  postImport(data) {
    return request.post('/metadata-schemas/import', data)
  },

  postPreview(metadataSchemaUuids) {
    return request.post('/metadata-schemas/preview', { metadataSchemaUuids }, {
      headers: {
        Accept: 'text/turtle',
      },
    })
  },
}
