import axios from 'axios'

const apiUrl = 'http://localhost:3000'

function get(url) {
  return axios.get(`${apiUrl}${url}`, {
    headers: { Accept: 'application/json' },
  })
}

function getFdp() {
  return get('/fdp')
}

function getCatalog(id) {
  return get(`/fdp/catalog/${id}`)
}

function getDataset(id) {
  return get(`/fdp/dataset/${id}`)
}

function getDistribution(id) {
  return get(`/fdp/distribution/${id}`)
}

export default {
  getFdp,
  getCatalog,
  getDataset,
  getDistribution,
}
