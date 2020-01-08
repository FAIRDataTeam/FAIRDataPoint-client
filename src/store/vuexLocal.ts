import _ from 'lodash'
import VuexPersistence from 'vuex-persist'

const vuexLocal = new VuexPersistence({
  key: `${_.get(window, 'config.publicPath', '')}/session`,
  storage: window.localStorage,
  reducer(state) {
    return { auth: { session: _.get(state, 'auth.session') } }
  },
})

export default vuexLocal
