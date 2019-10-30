<template>
  <div>
    <Page
      title="Users"
      content-only
    >
      <template v-slot:content>
        <StatusFlash :status="status" />
        <div class="item-list">
          <div
            v-for="user in users"
            :key="user.uuid"
            class="item-list__item"
          >
            <UserAvatar :user="user" />
            <div class="item-list__item__content">
              <div class="item-list__item__content__row">
                <router-link :to="`/users/${user.uuid}`">
                  {{ user.firstName }} {{ user.lastName }}
                </router-link>
                <b-badge
                  pill
                  variant="light"
                >
                  {{ user.role }}
                </b-badge>
              </div>
              <div class="item-list__item__content__row">
                {{ user.email }}
              </div>
            </div>
            <div class="item-list__item__actions">
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
            </div>
          </div>
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
import * as api from '../api'
import Page from '../components/Page.vue'
import StatusFlash from '../components/StatusFlash.vue'
import UserAvatar from '../components/UserAvatar.vue'
import Status from '../utils/Status'

export default {
  name: 'Users',
  components: {
    UserAvatar,
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
    fetchData() {
      this.status.setPending()

      api.getUsers()
        .then((response) => {
          this.users = response.data
          this.status.setDone()
        })
        .catch(() => this.status.setError('Unable to get users.'))
    },

    deleteUser(user) {
      if (window.confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}?`)) {
        api.deleteUser(user)
          .then(() => this.fetchData())
          .catch(() => this.status.setError('Unable to delete users.'))
      }
    },
  },
}
</script>
<style scoped lang="scss">
@import "../scss/variables";
@import "../scss/typography";


.create-link {
  display: inline-block;
  margin-top: 2rem;
  text-decoration: none;
}

.item-list {

  &__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $space-md 0;
    border-top: 1px solid $color-separator;

    &:last-child {
      border-bottom: 1px solid $color-separator;
    }

    &__content {
      margin-left: $space-md;
      flex-grow: 1;

      &__row {
        display: flex;
        align-items: center;

        .badge {
          margin-left: $space-sm;

          &-light {
            background: $color-background-highlighted;
          }
        }

        a {
          font-weight: bold;
          text-decoration: none;

          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }
}
</style>
