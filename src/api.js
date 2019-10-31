import axios from 'axios'
import { getUserToken } from './utils/localStorage'

const apiUrl = window.config.apiUrl || 'http://localhost:3000'

function createHeaders() {
  const headers = {
    Accept: 'application/json',
  }
  const token = getUserToken()
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  return headers
}

function getAuthenticated(url) {
  return axios.get(`${apiUrl}${url}`, {
    headers: createHeaders(),
  })
}

function postAuthenticated(url, data) {
  return axios.post(`${apiUrl}${url}`, data, {
    headers: createHeaders(),
  })
}

function putAuthenticated(url, data) {
  return axios.put(`${apiUrl}${url}`, data, {
    headers: createHeaders(),
  })
}

function deleteAuthenticated(url) {
  return axios.delete(`${apiUrl}${url}`, {
    headers: createHeaders(),
  })
}

export function fetchToken(email, password) {
  return axios.post(`${apiUrl}/tokens`, { email, password })
}

export function getFdp() {
  return getAuthenticated('/fdp')
}

export function getCatalog(id) {
  return getAuthenticated(`/fdp/catalog/${id}`)
}

export function getCatalogMembers(id) {
  return getAuthenticated(`/fdp/catalog/${id}/members`)
}

export function putCatalogMember(catalogId, userUuid, membershipUuid) {
  return putAuthenticated(`/fdp/catalog/${catalogId}/members/${userUuid}`, {
    membershipUuid,
  })
}

export function deleteCatalogMember(catalogId, userUuid) {
  return deleteAuthenticated(`/fdp/catalog/${catalogId}/members/${userUuid}`)
}

export function getDataset(id) {
  return getAuthenticated(`/fdp/dataset/${id}`)
}

export function getDatasetMembers(id) {
  return getAuthenticated(`/fdp/dataset/${id}/members`)
}

export function putDatasetMember(datasetId, userUuid, membershipUuid) {
  return putAuthenticated(`/fdp/dataset/${datasetId}/members/${userUuid}`, {
    membershipUuid,
  })
}

export function deleteDatasetMember(datasetId, userUuid) {
  return deleteAuthenticated(`/fdp/dataset/${datasetId}/members/${userUuid}`)
}

export function getDistribution(id) {
  return getAuthenticated(`/fdp/distribution/${id}`)
}

export function getUsers() {
  return getAuthenticated('/users')
}

export function getUser(id) {
  return getAuthenticated(`/users/${id}`)
}

export function getUserCurrent() {
  return getAuthenticated('/users/current')
}

export function postUser(user) {
  return postAuthenticated('/users', user)
}

export function putUser(user) {
  return putAuthenticated(`/users/${user.uuid}`, user)
}

export function deleteUser(user) {
  return deleteAuthenticated(`/users/${user.uuid}`)
}

export function putUserPassword(user, password) {
  return putAuthenticated(`/users/${user.uuid}/password`, { password })
}

export function getMemberships() {
  return getAuthenticated('/memberships')
}

export function getDashboard() {
  return getAuthenticated('/fdp/dashboard')
}
