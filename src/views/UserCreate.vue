<template>
  <Page
    title="Create User"
    content-only
  >
    <template v-slot:content>
      <div class="container">
        <form
          class="form"
          @submit.prevent="submit"
        >
          <StatusFlash
            :status="profileSubmitStatus"
            no-loading
          />
          <div
            class="form__group"
            :class="{'form__group--error': $v.user.name.$error}"
          >
            <label for="user-name">Name</label>
            <input
              id="user-name"
              v-model.trim="$v.user.name.$model"
              placeholder="Name"
            >
            <p
              v-if="!$v.user.name.required"
              class="invalid-feedback"
            >
              Field is required
            </p>
          </div>
          <div
            class="form__group"
            :class="{'form__group--error': $v.user.email.$error}"
          >
            <label for="user-email">Email</label>
            <input
              id="user-email"
              v-model.trim="$v.user.email.$model"
              placeholder="Email"
            >
            <p
              v-if="!$v.user.email.required"
              class="invalid-feedback"
            >
              Field is required
            </p>
            <p
              v-if="!$v.user.email.email"
              class="invalid-feedback"
            >
              This is not a valid email
            </p>
          </div>
          <div
            class="form__group"
            :class="{'form__group--error': $v.user.password.$error}"
          >
            <label for="password-password">New password</label>
            <input
              id="password-password"
              v-model.trim="$v.user.password.$model"
              placeholder="New password"
              type="password"
            >
            <p
              v-if="!$v.user.password.required"
              class="invalid-feedback"
            >
              Field is required
            </p>
          </div>
          <div
            class="form__group"
            :class="{'form__group--error': $v.user.passwordCheck.$error}"
          >
            <label for="password-confirmation">New password confirmation</label>
            <input
              id="password-confirmation"
              v-model.trim="$v.user.passwordCheck.$model"
              placeholder="New password again"
              type="password"
            >
            <p
              v-if="!$v.user.passwordCheck.passwordMatch"
              class="invalid-feedback"
            >
              Passwords don't match.
            </p>
          </div>
          <div>
            <button
              class="btn"
              :disabled="passwordSubmitStatus.isPending()"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </template>
  </Page>
</template>
<script>
import { required, email } from 'vuelidate/lib/validators'
import * as api from '../api'
import Page from '../components/Page.vue'
import StatusFlash from '../components/StatusFlash.vue'
import Status from '../utils/Status'

export default {
  name: 'UserDetail',
  components: { StatusFlash, Page },

  validations() {
    return {
      user: {
        name: { required },
        email: { required, email },
        password: { required },
        passwordCheck: {
          passwordMatch(value) {
            return this.user.password === value
          },
        },
      },
    }
  },

  data() {
    return {
      user: {
        name: null,
        email: null,
        password: null,
        passwordCheck: null,
      },
      status: new Status(),
      profileSubmitStatus: new Status(),
      passwordSubmitStatus: new Status(),
    }
  },

  watch: {
    $route: 'fetchData',
  },

  created() {
    this.fetchData()
  },

  methods: {
    fetchData() {
      this.status.setPending()

      api.getUser(this.$route.params.id)
        .then((response) => {
          this.user = response.data
          this.status.setDone()
        })
        .catch(() => this.status.setError('Unable to get users.'))
    },

    submit() {
      this.$v.user.$touch()

      if (!this.$v.user.$invalid) {
        this.profileSubmitStatus.setPending()
        api.postUser(this.user)
          .then((response) => {
            this.$router.replace(`/users/${response.data.uuid}`)
          })
          .catch(() => this.profileSubmitStatus.setError('User profile could not be updated.'))
      }
    },
  },
}
</script>
<style scoped lang="scss">
@import "../scss/variables";

.container {
  max-width: $container-small-max-width;
  margin: auto;

  .form {
    margin-bottom: 6rem;
  }
}
</style>
