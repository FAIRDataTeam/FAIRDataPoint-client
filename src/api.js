import axios from 'axios'

const apiUrl = 'http://localhost:3000'

function get(url) {
  return axios.get(`${apiUrl}${url}`, {
    headers: { Accept: 'application/json' },
  })
}

export function fetchToken(email, password) {
  return axios.post(`${apiUrl}/tokens`, { email, password })
}

export function getFdp() {
  return get('/fdp')
}

export function getCatalog(id) {
  return get(`/fdp/catalog/${id}`)
}

export function getDataset(id) {
  return get(`/fdp/dataset/${id}`)
}

export function getDistribution(id) {
  return get(`/fdp/distribution/${id}`)
}
