<template>
  <div>
    <page
      title="Users"
      content-only
    >
      <template v-slot:actions>
        <router-link
          to="/users/create"
          data-cy="create-user"
        >
          + Create user
        </router-link>
      </template>
      <template v-slot:content>
        <status-flash :status="status" />
        <div class="item-list">
          <user-item
            v-for="user in users"
            :key="user.uuid"
            :user="user"
          >
            <template v-slot:name>
              <router-link
                :to="`/users/${user.uuid}`"
                data-cy="user-link"
              >
                {{ user.firstName }} {{ user.lastName }}
              </router-link>
              <b-badge
                pill
                variant="light"
              >
                {{ user.role }}
              </b-badge>
            </template>
            <template v-slot:actions>
              <b-dropdown
                text="Actions"
                right
                variant="link"
                no-caret
              >
                <template v-slot:button-content>
                  <fa :icon="['fas', 'ellipsis-v']" />
                </template>
                <b-dropdown-item
                  @click="$router.push(`/users/${user.uuid}`)"
                >
                  <fa :icon="['fas', 'user-edit']" />
                  Edit profile
                </b-dropdown-item>
                <b-dropdown-divider />
                <b-dropdown-item
                  class="dropdown-item-danger"
                  @click.prevent="deleteUser(user)"
                >
                  <fa :icon="['far', 'trash-alt']" />
                  Remove
                </b-dropdown-item>
              </b-dropdown>
            </template>
          </user-item>
        </div>
      </template>
    </page>
  </div>
</template>
<script lang="ts">
import _ from 'lodash'
import api from '../../api'
import Page from '../../components/Page/index.vue'
import StatusFlash from '../../components/StatusFlash/index.vue'
import UserItem from '../../components/UserItem/index.vue'
import Status from '../../utils/Status'

export default {
  name: 'Users',
  components: {
    UserItem,
    StatusFlash,
    Page,
  },

  data() {
    return {
      users: null,
      status: new Status(),
    }
  },

  watch: {
    $route: 'fetchData',
  },

  created() {
    this.fetchData()
  },

  methods: {
    async fetchData() {
      try {
        this.status.setPending()

        const response = await api.users.getUsers()
        this.users = _.orderBy(response.data, ['firstName', 'lastName'], ['asc'])
        this.status.setDone()
      } catch (error) {
        this.status.setError('Unable to get users.')
      }
    },

    async deleteUser(user) {
      if (window.confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}?`)) {
        try {
          await api.users.deleteUser(user)
          this.fetchData()
        } catch (error) {
          this.status.setError('Unable to delete users.')
        }
      }
    },
  },
}
</script>
