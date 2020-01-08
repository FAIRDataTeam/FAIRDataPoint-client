<template>
  <div class="header">
    <div class="header__container">
      <router-link
        to="/"
        class="header__repository-name"
      >
        <span class="header__repository-name__title--full">
          FAIR Data Point
        </span>
        <span class="header__repository-name__title--short">
          FDP
        </span>
      </router-link>
      <div class="header__nav">
        <!-- <SearchField /> -->
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
              <user-avatar
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
    <separator />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Separator from '../Separator/index.vue'
import UserAvatar from '../UserAvatar/index.vue'


@Component({
  components: {
    UserAvatar,
    Separator,
  },
})
export default class FdpHeader extends Vue {
  get authenticated() {
    return this.$store.getters['auth/authenticated']
  }

  get user() {
    return this.$store.getters['auth/user']
  }

  logout() {
    this.$store.dispatch('auth/logout')
    if (this.$router.currentRoute.path !== '/') {
      this.$router.push('/')
    }
  }
}
</script>
