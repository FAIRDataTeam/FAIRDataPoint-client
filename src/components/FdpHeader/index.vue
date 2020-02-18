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
                Manage users
              </b-dropdown-item>
              <b-dropdown-item v-b-modal.info-modal>
                <fa :icon="['fas', 'user-friends']" />
                About
              </b-dropdown-item>
              <b-dropdown-divider />
            </template>
            <b-dropdown-header data-cy="user-menu-user">
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
    <b-modal
      id="info-modal"
      hide-footer
      title="About"
    >
      <version-info-table
        title="Server"
        :version="info.version"
        :built-at="info.builtAt"
      />
      <version-info-table
        title="Client"
        version="{version}"
        built-at="{builtAt}"
      />
    </b-modal>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import api from '../../api'
import Separator from '../Separator/index.vue'
import UserAvatar from '../UserAvatar/index.vue'
import VersionInfoTable from '../VersionInfoTable/index.vue'


@Component({
  components: {
    Separator,
    UserAvatar,
    VersionInfoTable,
  },
})
export default class FdpHeader extends Vue {
  info: any = { version: '', builtAt: '' }

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

  created() {
    this.fetchData()
  }

  async fetchData(): Promise<void> {
    const response = await api.info.getInfo()
    this.info = response.data
  }
}
</script>
