import _ from 'lodash'
import api from '../../api'
import localStorage from '../../utils/localStorage'
import Status from '../../utils/Status'

export default {
  namespaced: true,

  state: {
    session: localStorage.getSession(),
    loginStatus: new Status(),
  },

  getters: {
    authenticated: state => state.session !== null,
    user: state => _.get(state.session, 'user'),
    role: state => _.get(state.session, 'user.role'),
    token: state => _.get(state, 'session.token'),
  },

  actions: {
    authenticate({ commit }, { email, password, successCallback }) {
      commit('setLoginStatus', { status: Status.PENDING })
      api.fetchToken(email, password)
        .then((response) => {
          commit('setSession', { user: null, token: response.data.token })

          api.getUserCurrent()
            .then((userResponse) => {
              commit('setLoginStatus', { status: Status.DEFAULT })
              const session = { user: userResponse.data, token: response.data.token }
              commit('setSession', session)
              localStorage.saveSession(session)
              successCallback()
            })
            .catch(() => {
              commit('setSession', null)
              commit('setLoginStatus', { status: Status.ERROR, msg: 'Login failed' })
            })
        })
        .catch(() => {
          commit('setLoginStatus', { status: Status.ERROR, msg: 'Login failed' })
        })
    },

    updateUser({ commit, state }, { user }) {
      const session = {
        user,
        token: state.session.token,
      }
      localStorage.saveSession(session)
      commit('setSession', session)
    },

    logout({ commit }) {
      localStorage.clearSession()
      commit('setSession', null)
    },
  },

  mutations: {
    setSession(state, session) {
      state.session = session
    },
    setLoginStatus(state, { status, msg }) {
      state.loginStatus.setStatus(status, msg)
    },
  },
}
