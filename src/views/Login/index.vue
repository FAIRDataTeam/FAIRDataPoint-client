<template>
  <div class="login">
    <h1>Login</h1>
    <status-flash
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
          name="email"
        >
      </div>
      <div class="form__group">
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          name="password"
        >
      </div>
      <div>
        <button
          class="btn btn-primary btn-full btn-rounded"
          :disabled="status.isPending()"
          data-cy="login"
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
<script lang="ts">
import { mapGetters } from 'vuex'
import StatusFlash from '../../components/StatusFlash/index.vue'
import Status from '../../utils/Status'

export default {
  name: 'Login',
  components: { StatusFlash },
  data() {
    return {
      email: '',
      password: '',
      status: new Status(),
    }
  },

  computed: {
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

      this.status.setPending()
      this.$store.dispatch('auth/authenticate', {
        email: this.email,
        password: this.password,
        onSuccess: () => this.$router.push('/'),
        onError: () => this.status.setError('Login failed'),
      })
    },
  },
}
</script>
