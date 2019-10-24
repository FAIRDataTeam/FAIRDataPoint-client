<template>
  <div>
    <Page
      title="Users"
      content-only
    >
      <template v-slot:content>
        <StatusFlash :status="status" />
        <Table :data="users">
          <template v-slot:header>
            <th>User</th>
            <th class="desktop-only">
              Email
            </th>
            <th />
          </template>

          <template v-slot:row="user">
            <td>
              <router-link :to="`/users/${user.uuid}`">
                {{ user.name }}
              </router-link>
            </td>
            <td>
              {{ user.email }}
            </td>
            <td>
            </td>
          </template>

          <template v-slot:empty>
            There are no users, you can
            <router-link to="/users/create">
              create
            </router-link>
            a new one.
          </template>
        </Table>
      </template>
    </Page>
  </div>
</template>
<script>
import * as api from '../api'
import Page from '../components/Page.vue'
import StatusFlash from '../components/StatusFlash.vue'
import Table from '../components/Table.vue'
import Status from '../utils/Status'

export default {
  name: 'Users',
  components: { Table, StatusFlash, Page },

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
    fetchData() {
      this.status.setPending()

      api.getUsers()
        .then((response) => {
          this.users = response.data
          this.status.setDone()
        })
        .catch(() => this.status.setError('Unable to get users.'))
    },
  },
}
</script>
