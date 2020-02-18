import _ from 'lodash'
import api from '../../api'

export default {
  namespaced: true,

  state: {
    session: null,
  },

  getters: {
    authenticated: state => state.session !== null,
    user: state => _.get(state.session, 'user'),
    role: state => _.get(state.session, 'user.role'),
    isAdmin: state => _.get(state.session, 'user.role') === 'ADMIN',
    token: state => _.get(state, 'session.token'),
  },

  actions: {
    async authenticate({ commit }, {
      email, password, onSuccess, onError,
    }) {
      try {
        const response = await api.tokens.fetchToken(email, password)
        commit('setSession', { user: null, token: response.data.token })
        const userResponse = await api.users.getUserCurrent()
        const session = { user: userResponse.data, token: response.data.token }
        commit('setSession', session)
        onSuccess()
      } catch (error) {
        commit('setSession', null)
        onError()
      }
    },

    updateUser({ commit, state }, { user }) {
      const session = {
        user,
        token: state.session.token,
      }
      commit('setSession', session)
    },

    logout({ commit }) {
      commit('setSession', null)
    },
  },

  mutations: {
    setSession(state, session) {
      state.session = session
    },
  },
}
