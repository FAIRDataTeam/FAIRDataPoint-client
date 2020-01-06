import VuexPersistence from 'vuex-persist'

const vuexLocal = new VuexPersistence({
  key: `${window.config.publicPath}/session`,
  storage: window.localStorage,
  reducer(state) {
    return { auth: { session: state.auth.session } }
  },
})

export default vuexLocal
