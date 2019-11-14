<template>
  <div class="header">
    <div class="header__container">
      <router-link
        to="/"
        class="header__fdp-name"
      >
        FAIR Data Point
      </router-link>
      <div class="header__nav">
        <div class="header__search-field">
          <fa :icon="['fas', 'search']" />
          <input
            type="text"
            placeholder="Search FAIR Data Point..."
          >
        </div>
        <div class="header__menu">
          <router-link
            v-if="!user"
            to="/login"
          >
            Log in
          </router-link>
          <b-dropdown
            v-else
            right
            variant="link"
          >
            <template v-slot:button-content>
              <UserAvatar
                :user="user"
                smaller
              />
            </template>
            <template v-if="user.role === 'ADMIN'">
              <b-dropdown-header>
                FAIR Data Point
              </b-dropdown-header>
              <b-dropdown-item @click="$router.push('/users')">
                <fa :icon="['fas', 'user-friends']" />
                Manage users
              </b-dropdown-item>
              <b-dropdown-divider />
            </template>
            <b-dropdown-header>
              {{ user.firstName }} {{ user.lastName }}
            </b-dropdown-header>
            <b-dropdown-item @click="$router.push(`/my-metadata`)">
              <fa :icon="['fas', 'project-diagram']" />
              My Metadata
            </b-dropdown-item>
            <b-dropdown-item
              v-if="user.role === 'ADMIN'"
              @click="$router.push(`/users/${user.uuid}`)"
            >
              <fa :icon="['fas', 'user-edit']" />
              Edit profile
            </b-dropdown-item>
            <b-dropdown-item @click="logout">
              <fa :icon="['fas', 'sign-out-alt']" />
              Log out
            </b-dropdown-item>
          </b-dropdown>
        </div>
      </div>
    </div>
    <Separator />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Separator from '../Separator'
import UserAvatar from '../UserAvatar'

export default {
  name: 'Header',
  components: {
    UserAvatar,
    Separator,
  },
  computed: {
    ...mapGetters('auth', {
      authenticated: 'authenticated',
      user: 'user',
    }),
  },
  methods: {
    logout() {
      this.$store.dispatch('auth/logout')
      if (this.$router.currentRoute.path !== '/fdp') {
        this.$router.push('/fdp')
      }
    },
  },
}
</script>
