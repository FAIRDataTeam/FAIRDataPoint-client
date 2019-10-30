import _ from 'lodash'
import * as api from '../../api'
import { clearSession, getSession, saveSession } from '../../utils/localStorage'
import Status from '../../utils/Status'

export default {
  namespaced: true,

  state: {
    session: getSession(),
    loginStatus: new Status(),
  },

  getters: {
    authenticated: state => state.session !== null,
    user: state => _.get(state.session, 'user'),
    role: state => _.get(state.session, 'user.role'),
  },

  actions: {
    authenticate({ commit }, { email, password, successCallback }) {
      commit('setLoginStatus', { status: Status.PENDING })
      api.fetchToken(email, password)
        .then((response) => {
          saveSession({ user: null, token: response.data.token })

          api.getUserCurrent()
            .then((userResponse) => {
              commit('setLoginStatus', { status: Status.DEFAULT })
              const session = { user: userResponse.data, token: response.data.token }
              commit('setSession', session)
              saveSession(session)
              successCallback()
            })
            .catch(() => {
              clearSession()
              commit('setLoginStatus', { status: Status.ERROR, msg: 'Login failed' })
            })
        })
        .catch(() => {
          commit('setLoginStatus', { status: Status.ERROR, msg: 'Login failed' })
        })
    },

    logout({ commit }) {
      clearSession()
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
