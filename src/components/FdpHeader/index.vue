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
        <search-field />
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
            data-cy="user-menu"
          >
            <template v-slot:button-content>
              <user-avatar
                :user="user"
                smaller
              />
            </template>
            <template v-if="user.role === 'ADMIN'">
              <b-dropdown-header data-cy="user-menu-admin">
                FAIR Data Point
              </b-dropdown-header>
              <b-dropdown-item @click="$router.push('/users')">
                <fa :icon="['fas', 'user-friends']" />
                Users
              </b-dropdown-item>
              <b-dropdown-item
                v-if="isIndex"
                @click="$router.push('/trigger-ping')"
              >
                <fa :icon="['fas', 'sync-alt']" />
                Trigger ping
              </b-dropdown-item>
              <b-dropdown-item
                v-if="isIndex"
                @click="$router.push('/settings')"
              >
                <fa :icon="['fas', 'cogs']" />
                Settings
              </b-dropdown-item>
              <b-dropdown-item
                v-if="!isIndex"
                @click="$router.push('/resource-definitions')"
              >
                <fa :icon="['fas', 'sitemap']" />
                Resources definitions
              </b-dropdown-item>
              <b-dropdown-item
                v-if="!isIndex"
                @click="$router.push('/shapes')"
              >
                <fa :icon="['fas', 'shapes']" />
                SHACL shapes
              </b-dropdown-item>
              <b-dropdown-item
                v-if="!isIndex"
                @click="$router.push('/reset-to-defaults')"
              >
                <fa :icon="['fas', 'trash']" />
                Reset to defaults
              </b-dropdown-item>
              <b-dropdown-divider />
            </template>
            <b-dropdown-header data-cy="user-menu-user">
              {{ user.firstName }} {{ user.lastName }}
            </b-dropdown-header>
            <b-dropdown-item
              v-if="!isIndex"
              @click="$router.push(`/my-metadata`)"
            >
              <fa :icon="['fas', 'project-diagram']" />
              My Metadata
            </b-dropdown-item>
            <b-dropdown-item @click="$router.push(`/api-keys`)">
              <fa :icon="['fas', 'key']" />
              API Keys
            </b-dropdown-item>
            <b-dropdown-item @click="$router.push('/users/current')">
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
import VersionInfoTable from '../VersionInfoTable/index.vue'
import SearchField from '@/components/SearchField/index.vue'
import config from '@/config'


@Component({
  components: {
    SearchField,
    Separator,
    UserAvatar,
    VersionInfoTable,
  },
})
export default class FdpHeader extends Vue {
  get authenticated() {
    return this.$store.getters['auth/authenticated']
  }

  get user() {
    return this.$store.getters['auth/user']
  }

  get isIndex() {
    return config.isIndex()
  }

  logout() {
    this.$store.dispatch('auth/logout')
    if (this.$router.currentRoute.path !== '/') {
      this.$router.push('/')
    }
    window.location.reload()
  }
}
</script>
