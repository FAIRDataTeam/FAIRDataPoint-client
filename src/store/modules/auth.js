import * as api from '../../api'
import { clearUserToken, getUserToken, setUserToken } from '../../utils/localStorage'
import Status from '../../utils/Status'

export default {
  namespaced: true,

  state: {
    token: getUserToken(),
    loginStatus: new Status(),
  },

  getters: {
    authenticated: state => state.token !== null,
  },

  actions: {
    authenticate({ commit }, { email, password }) {
      commit('setLoginStatus', { status: Status.PENDING })
      api.fetchToken(email, password)
        .then((response) => {
          setUserToken(response.data.token)
          commit('setLoginStatus', { status: Status.DEFAULT })
          commit('setToken', response.data.token)
        })
        .catch(() => {
          commit('setLoginStatus', { status: Status.ERROR, msg: 'Login failed' })
        })
    },

    logout({ commit }) {
      clearUserToken()
      commit('setToken', null)
    },
  },

  mutations: {
    setToken(state, token) {
      state.token = token
    },
    setLoginStatus(state, { status, msg }) {
      state.loginStatus.setStatus(status, msg)
    },
  },
}
