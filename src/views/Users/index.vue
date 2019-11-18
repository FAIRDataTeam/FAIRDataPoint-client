<template>
  <div>
    <Page
      title="Users"
      content-only
    >
      <template v-slot:content>
        <StatusFlash :status="status" />
        <div class="item-list">
          <UserItem
            v-for="user in users"
            :key="user.uuid"
            :user="user"
          >
            <template v-slot:name>
              <router-link :to="`/users/${user.uuid}`">
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
          </UserItem>
        </div>
        <router-link
          class="create-link"
          to="/users/create"
        >
          + Create user
        </router-link>
      </template>
    </Page>
  </div>
</template>
<script>
import _ from 'lodash'
import api from '../../api'
import Page from '../../components/Page'
import StatusFlash from '../../components/StatusFlash'
import UserItem from '../../components/UserItem'
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

        const response = await api.getUsers()
        this.users = _.orderBy(response.data, ['firstName', 'lastName'], ['asc'])
        this.status.setDone()
      } catch (error) {
        this.status.setError('Unable to get users.')
      }
    },

    async deleteUser(user) {
      if (window.confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}?`)) {
        try {
          await api.deleteUser(user)
          this.fetchData()
        } catch (error) {
          this.status.setError('Unable to delete users.')
        }
      }
    },
  },
}
</script>
<style scoped lang="scss">
@import "../../scss/variables";
@import "../../scss/typography";


.create-link {
  display: inline-block;
  margin-top: 2rem;
  text-decoration: none;
}

</style>