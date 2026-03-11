<template>
  <div>
    <breadcrumbs
      :links="breadcrumbs"
      current="Create user"
    />
    <page
      title="Create user"
      content-only
      small
    >
      <template #content>
        <form
          class="form"
          @submit.prevent="submit"
        >
          <status-flash
            :status="profileSubmitStatus"
            no-loading
          />
          <div
            class="form__group"
            :class="{ 'form__group--error': v$.user.firstName.$error }"
          >
            <label for="user-first-name">First name</label>
            <input
              id="user-first-name"
              v-model.trim="v$.user.firstName.$model"
              placeholder="First name"
              name="firstName"
            >
            <p
              v-if="!v$.user.firstName.required"
              class="invalid-feedback"
            >
              Field is required
            </p>
          </div>
          <div
            class="form__group"
            :class="{ 'form__group--error': v$.user.lastName.$error }"
          >
            <label for="user-last-name">Last name</label>
            <input
              id="user-last-name"
              v-model.trim="v$.user.lastName.$model"
              placeholder="Last name"
              name="lastName"
            >
            <p
              v-if="!v$.user.lastName.required"
              class="invalid-feedback"
            >
              Field is required
            </p>
          </div>
          <div
            class="form__group"
            :class="{ 'form__group--error': v$.user.email.$error }"
          >
            <label for="user-email">Email</label>
            <input
              id="user-email"
              v-model.trim="v$.user.email.$model"
              placeholder="Email"
              name="email"
            >
            <p
              v-if="!v$.user.email.required"
              class="invalid-feedback"
            >
              Field is required
            </p>
            <p
              v-if="!v$.user.email.email"
              class="invalid-feedback"
            >
              This is not a valid email
            </p>
          </div>
          <div class="form__group">
            <label for="user-role">Role</label>
            <select
              id="user-role"
              v-model="user.role"
              name="role"
            >
              <option value="USER">
                USER
              </option>
              <option value="ADMIN">
                ADMIN
              </option>
            </select>
          </div>
          <div
            class="form__group"
            :class="{ 'form__group--error': v$.user.password.$error }"
          >
            <label for="password-password">New password</label>
            <input
              id="password-password"
              v-model.trim="v$.user.password.$model"
              placeholder="New password"
              type="password"
              name="password"
            >
            <p
              v-if="!v$.user.password.required"
              class="invalid-feedback"
            >
              Field is required
            </p>
          </div>
          <div
            class="form__group"
            :class="{ 'form__group--error': v$.user.passwordCheck.$error }"
          >
            <label for="password-confirmation">New password confirmation</label>
            <input
              id="password-confirmation"
              v-model.trim="v$.user.passwordCheck.$model"
              placeholder="New password again"
              type="password"
              name="passwordConfirmation"
            >
            <p
              v-if="!v$.user.passwordCheck.passwordMatch"
              class="invalid-feedback"
            >
              Passwords don't match.
            </p>
          </div>
          <div>
            <button
              class="btn btn-primary btn-rounded"
              :disabled="passwordSubmitStatus.isPending()"
              data-cy="create-user"
            >
              Create user
            </button>
          </div>
        </form>
      </template>
    </page>
  </div>
</template>
<script lang="ts">
import { useVuelidate } from '@vuelidate/core'
import { email, required } from '@vuelidate/validators'
import api from '../../api'
import Breadcrumbs from '../../components/Breadcrumbs/index.vue'
import Page from '../../components/Page/index.vue'
import StatusFlash from '../../components/StatusFlash/index.vue'
import Status from '../../utils/Status'

export default {
  name: 'UserDetail',
  components: { Breadcrumbs, StatusFlash, Page },
  setup() {
    return { v$: useVuelidate() }
  },

  validations() {
    return {
      user: {
        firstName: { required },
        lastName: { required },
        email: { required, email },
        password: { required },
        passwordCheck: {
          passwordMatch: (value) => this.user.password === value,
        },
      },
    }
  },

  data() {
    return {
      user: {
        firstName: null,
        lastName: null,
        email: null,
        role: 'USER',
        password: null,
        passwordCheck: null,
      },
      status: new Status(),
      profileSubmitStatus: new Status(),
      passwordSubmitStatus: new Status(),
      breadcrumbs: [{
        label: 'Users',
        to: '/users',
      }],
    }
  },

  methods: {
    async submit() {
      this.v$.user.$touch()

      if (!this.v$.user.$invalid) {
        this.profileSubmitStatus.setPending()
        try {
          await api.users.postUser(this.user)
          await this.$router.replace('/users')
        } catch (error) {
          this.profileSubmitStatus.setErrorFromResponse(error, 'User profile could not be created.')
        }
      }
    },
  },
}
</script>
