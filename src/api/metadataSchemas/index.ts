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

  get(uuid: string) {
    return request.get(`/metadata-schemas/${uuid}`)
  },

  getDraft(uuid: string) {
    return request.get(`/metadata-schemas/${uuid}/draft`)
  },

  post(schema: Record<string, unknown>) {
    return request.post('/metadata-schemas', schema)
  },

  putDraft(schema: { uuid: string } & Record<string, unknown>) {
    return request.put(`/metadata-schemas/${schema.uuid}/draft`, schema)
  },

  postVersion(
    schema: { uuid: string } & Record<string, unknown>,
    version: Record<string, unknown>,
  ) {
    return request.post(`/metadata-schemas/${schema.uuid}/versions`, version)
  },

  delete(uuid: string) {
    return request.delete(`/metadata-schemas/${uuid}`)
  },

  getImport(url: string) {
    return request.get(`/metadata-schemas/import?from=${encodeURIComponent(url)}`)
  },

  getUpdate() {
    return request.get('/metadata-schemas/updates')
  },

  postImport(data: Record<string, unknown>) {
    return request.post('/metadata-schemas/import', data)
  },

  postPreview(metadataSchemaUuids: string[]) {
    return request.post('/metadata-schemas/preview', { metadataSchemaUuids }, {
      headers: {
        Accept: 'text/turtle',
      },
    })
  },
}
