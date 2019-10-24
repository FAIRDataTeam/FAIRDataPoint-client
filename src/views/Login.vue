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
          class="btn btn--full btn--rounded"
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
import StatusFlash from '../components/StatusFlash.vue'

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
      this.$router.replace('/fdp')
    }

    this.$store.watch(
      (state, getters) => getters['auth/authenticated'],
      (newValue) => {
        if (newValue) {
          this.$router.push('/fdp')
        }
      },
    )
  },

  methods: {
    submit() {
      if (!this.email || !this.password) return

      this.$store.dispatch('auth/authenticate', {
        email: this.email,
        password: this.password,
      })
    },
  },
}
</script>
<style scoped lang="scss">
@import "../scss/variables";
@import "../scss/mixins";
@import "../scss/text-styles";

.login {
  h1 {
    @include text-style-default-32-bold;
  }

  @include border-radius($border-radius-default);
  width: 100%;
  max-width: 20rem;
  margin: 4rem auto;
  padding: $space-md;

  .btn {
    svg {
      margin-right: $space-sm;

      &.fa-spinner {
        margin-right: 0 !important;
      }
    }
  }
}
</style>
