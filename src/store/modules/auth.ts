import _ from 'lodash'
import api from '../../api'

type AuthSession = {
  user: any
  token: string
}

type AuthState = {
  session: AuthSession | null
}

export default {
  namespaced: true,

  state: {
    session: null,
  },

  getters: {
    authenticated: (state: AuthState) => state.session !== null,
    user: (state: AuthState) => _.get(state.session, 'user'),
    role: (state: AuthState) => _.get(state.session, 'user.role'),
    isAdmin: (state: AuthState) => _.get(state.session, 'user.role') === 'ADMIN',
    token: (state: AuthState) => _.get(state, 'session.token'),
  },

  actions: {
    async authenticate(
      { commit }: { commit: (type: string, payload: AuthSession | null) => void },
      {
        email,
        password,
        onSuccess,
        onError,
      }: {
        email: string
        password: string
        onSuccess: () => void
        onError: () => void
      },
    ) {
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

    updateUser(
      { commit, state }: { commit: (type: string, payload: AuthSession) => void; state: AuthState },
      { user }: { user: any },
    ) {
      if (!state.session) {
        return
      }
      const session = {
        user,
        token: state.session.token,
      }
      commit('setSession', session)
    },

    logout({ commit }: { commit: (type: string, payload: AuthSession | null) => void }) {
      commit('setSession', null)
    },
  },

  mutations: {
    setSession(state: AuthState, session: AuthSession | null) {
      state.session = session
    },
  },
}
