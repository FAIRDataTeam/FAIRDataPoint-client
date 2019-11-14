<template>
  <div>
    <Breadcrumbs
      v-if="user"
      :links="breadcrumbs"
      :current="title"
    />
    <Page
      :title="title"
      content-only
      small
    >
      <template v-slot:content>
        <StatusFlash :status="status" />
        <div v-if="user">
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
              :class="{'form__group--error': $v.user.firstName.$error}"
            >
              <label for="user-first-name">First name</label>
              <input
                id="user-first-name"
                v-model.trim="$v.user.firstName.$model"
                placeholder="First name"
              >
              <p
                v-if="!$v.user.firstName.required"
                class="invalid-feedback"
              >
                Field is required
              </p>
            </div>
            <div
              class="form__group"
              :class="{'form__group--error': $v.user.lastName.$error}"
            >
              <label for="user-last-name">Last name</label>
              <input
                id="user-last-name"
                v-model.trim="$v.user.lastName.$model"
                placeholder="Last name"
              >
              <p
                v-if="!$v.user.lastName.required"
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
            <div class="form__group">
              <label for="user-role">Role</label>
              <select
                id="user-role"
                v-model="user.role"
              >
                <option value="USER">
                  USER
                </option>
                <option value="ADMIN">
                  ADMIN
                </option>
              </select>
            </div>
            <div>
              <button
                class="btn btn-primary btn-rounded"
                :disabled="profileSubmitStatus.isPending()"
              >
                Save profile
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
                class="btn btn-primary btn-rounded"
                :disabled="passwordSubmitStatus.isPending()"
              >
                Update password
              </button>
            </div>
          </form>
        </div>
      </template>
    </Page>
  </div>
</template>
<script>
import { required, email } from 'vuelidate/lib/validators'
import { mapGetters } from 'vuex'
import * as api from '../../api'
import Breadcrumbs from '../../components/Breadcrumbs'
import Page from '../../components/Page'
import StatusFlash from '../../components/StatusFlash'
import Status from '../../utils/Status'

export default {
  name: 'UserDetail',
  components: { Breadcrumbs, StatusFlash, Page },

  validations() {
    return {
      user: {
        firstName: { required },
        lastName: { required },
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
      title: null,
      user: null,
      passwordForm: {
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

  computed: {
    ...mapGetters('auth', {
      currentUser: 'user',
    }),
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
          this.setTitle()
          this.status.setDone()
        })
        .catch(() => this.status.setError('Unable to get user profile.'))
    },

    submitProfile() {
      this.$v.user.$touch()

      if (!this.$v.user.$invalid) {
        this.profileSubmitStatus.setPending()
        api.putUser(this.user)
          .then(() => {
            this.setTitle()
            this.profileSubmitStatus.setDone('User profile was successfully updated!')

            if (this.user.uuid === this.currentUser.uuid) {
              this.$store.dispatch('auth/updateUser', { user: this.user })
            }
          })
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

    setTitle() {
      this.title = `${this.user.firstName} ${this.user.lastName}`
    },
  },
}
</script>
