<template>
  <Page
    title="User Detail"
    content-only
  >
    <template v-slot:content>
      <StatusFlash :status="status" />
      <div
        v-if="user"
        class="container"
      >
        <form
          class="form"
          @submit.prevent="submitProfile"
        >
          <h2>Profile</h2>
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
          <div>
            <button
              class="btn"
              :disabled="profileSubmitStatus.isPending()"
            >
              Save
            </button>
          </div>
        </form>

        <form
          class="form"
          @submit.prevent="submitPassword"
        >
          <h2>Password</h2>
          <StatusFlash
            :status="passwordSubmitStatus"
            no-loading
          />
          <div
            class="form__group"
            :class="{'form__group--error': $v.passwordForm.password.$error}"
          >
            <label for="password-password">New password</label>
            <input
              id="password-password"
              v-model.trim="$v.passwordForm.password.$model"
              placeholder="New password"
              type="password"
            >
            <p
              v-if="!$v.passwordForm.password.required"
              class="invalid-feedback"
            >
              Field is required
            </p>
          </div>
          <div
            class="form__group"
            :class="{'form__group--error': $v.passwordForm.passwordCheck.$error}"
          >
            <label for="password-confirmation">New password confirmation</label>
            <input
              id="password-confirmation"
              v-model.trim="$v.passwordForm.passwordCheck.$model"
              placeholder="New password again"
              type="password"
            >
            <p
              v-if="!$v.passwordForm.passwordCheck.passwordMatch"
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
      },
      passwordForm: {
        password: { required },
        passwordCheck: {
          passwordMatch(value) {
            return this.passwordForm.password === value
          },
        },
      },
    }
  },

  data() {
    return {
      user: null,
      passwordForm: {
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
        .catch(() => this.status.setError('Unable to get user profile.'))
    },

    submitProfile() {
      this.$v.user.$touch()

      if (!this.$v.user.$invalid) {
        this.profileSubmitStatus.setPending()
        api.putUser(this.user)
          .then(() => this.profileSubmitStatus.setDone('User profile was successfully updated!'))
          .catch(() => this.profileSubmitStatus.setError('User profile could not be updated.'))
      }
    },

    submitPassword() {
      this.$v.passwordForm.$touch()

      if (!this.$v.passwordForm.$invalid) {
        this.passwordSubmitStatus.setPending()
        api.putUserPassword(this.user, this.passwordForm.password)
          .then(() => this.passwordSubmitStatus.setDone('Password was successfully updated!'))
          .catch(() => this.passwordSubmitStatus.setError('Password could not be updated.'))
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
