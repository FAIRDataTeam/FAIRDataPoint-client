<template>
  <div class="login">
    <h1>Login</h1>
    <StatusFlash
      :status="status"
      no-loading
    />
    <form
      class="form"
      @submit.prevent="submit"
    >
      <div class="form__group">
        <input
          v-model="email"
          type="text"
          placeholder="Email"
        >
      </div>
      <div class="form__group">
        <input
          v-model="password"
          type="password"
          placeholder="Password"
        >
      </div>
      <div>
        <button
          class="btn btn-primary btn-full btn-rounded"
          :disabled="status.isPending()"
        >
          <fa
            v-if="status.isPending()"
            :icon="['fas', 'spinner']"
            spin
          />
          <template v-else>
            <fa :icon="['fas', 'sign-in-alt']" />
            Login
          </template>
        </button>
      </div>
    </form>
  </div>
</template>
<script>
import { mapGetters, mapState } from 'vuex'
import StatusFlash from '../../components/StatusFlash'

export default {
  name: 'Login',
  components: { StatusFlash },
  data() {
    return {
      email: '',
      password: '',
    }
  },

  computed: {
    ...mapState('auth', {
      status: 'loginStatus',
    }),
    ...mapGetters('auth', {
      authenticated: 'authenticated',
    }),
  },

  created() {
    if (this.authenticated) {
      this.$router.replace('/')
    }
  },

  methods: {
    submit() {
      if (!this.email || !this.password) return

      this.$store.dispatch('auth/authenticate', {
        email: this.email,
        password: this.password,
        successCallback: () => this.$router.push('/'),
      })
    },
  },
}
</script>
