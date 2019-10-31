<template>
  <div>
    <Breadcrumbs
      v-if="entity !== null"
      :links="breadcrumbs"
      current="Settings"
    />
    <StatusFlash :status="status" />
    <Page
      v-if="entity !== null"
      :title="`${entity.title} Settings`"
      content-only
    >
      <template v-slot:content>
        <h2>Users</h2>

        <div class="invite-user">
          <h3>Invite user</h3>
          <StatusFlash
            :status="inviteStatus"
            no-loading
          />
          <form
            class="form form--inline"
            @submit.prevent="submitInvite"
          >
            <div class="form__group form__group--fill">
              <label>User</label>
              <v-select
                v-model="inviteForm.userUuid"
                :options="users"
                :reduce="user => user.uuid"
                label="fullName"
                placeholder="Search for users"
              >
                <template v-slot:option="option">
                  <UserItem
                    :user="option"
                    frameless
                  />
                </template>
              </v-select>
            </div>
            <div class="form__group">
              <label>Membership</label>
              <select
                id="user-role"
                v-model="inviteForm.membershipUuid"
              >
                <option
                  v-for="membership in memberships"
                  :key="membership.uuid"
                  :value="membership.uuid"
                >
                  {{ membership.name }}
                </option>
              </select>
            </div>
            <div class="form__group">
              <button
                class="btn btn-primary btn-rounded"
                :disabled="inviteForm.userUuid === null || inviteStatus.isPending()"
              >
                <fa
                  v-if="inviteStatus.isPending()"
                  :icon="['fas', 'spinner']"
                  spin
                />
                <fa
                  v-else
                  :icon="['fas', 'user-plus']"
                />
                Invite
              </button>
            </div>
          </form>
        </div>

        <div class="user-access">
          <h3>Users with access to {{ entity.title }}</h3>
          <div class="item-list">
            <UserItem
              v-for="member in members"
              :key="member.user.uuid"
              :user="member.user"
            >
              <template v-slot:actions>
                <b-dropdown
                  variant="outline-secondary btn-rounded"
                  :text="member.membership.name"
                  right
                >
                  <b-dropdown-item
                    v-for="membership in memberships"
                    :key="membership.uuid"
                    @click="updateMember(member.user.uuid, membership.uuid)"
                  >
                    {{ membership.name }}
                  </b-dropdown-item>
                </b-dropdown>
                <a
                  class="text-danger remove-user-action"
                  @click="removeMember(member.user)"
                >
                  <fa :icon="['fas', 'user-slash']" />
                </a>
              </template>
            </UserItem>
          </div>
        </div>
      </template>
    </Page>
  </div>
</template>
<script>
import _ from 'lodash'
import { required } from 'vuelidate/lib/validators'
import axios from 'axios'
import * as api from '../api'
import Breadcrumbs from './Breadcrumbs.vue'
import Page from './Page.vue'
import StatusFlash from './StatusFlash.vue'
import UserItem from './UserItem.vue'
import Status from '../utils/Status'
import { fullName, sortUsers } from '../utils/users'

export default {
  name: 'EntitySettings',
  components: {
    StatusFlash, UserItem, Page, Breadcrumbs,
  },

  validations() {
    return {
      inviteForm: {
        userUuid: { required },
        membershipUuid: { required },
      },
    }
  },

  props: {
    config: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      entity: null,
      members: null,
      users: null,
      memberships: null,
      breadcrumbs: null,
      status: new Status(),
      inviteStatus: new Status(),
      inviteForm: {
        userUuid: null,
        membershipUuid: null,
      },
    }
  },

  computed: {
    entityId() {
      return this.$route.params.id
    },
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

      const requests = [
        this.config.getEntity(this.entityId),
        this.config.getEntityMembers(this.entityId),
        api.getUsers(),
        api.getMemberships(),
      ]

      axios.all(requests)
        .then(([entity, members, users, memberships]) => {
          this.entity = entity.data
          this.members = _.orderBy(members.data, ['user.firstName', 'user.lastName'], ['asc'])
          this.users = this.createUsers(users.data, this.members)

          this.memberships = this.createMemberships(memberships.data)
          this.inviteForm.membershipUuid = _.get(this.memberships, '0.uuid')

          this.breadcrumbs = this.config.createBreadcrumbs(this.entity)
          this.status.setDone()
        })
        .catch((error) => {
          if (_.get(error, 'response.status') === 403) {
            this.$router.replace(`/fdp/${this.config.entityType.toLowerCase()}/${this.entityId}`)
          } else {
            this.status.setErrorFromResponse(error, 'Unable to get data.')
          }
        })
    },

    createUsers(users, members) {
      return sortUsers(users
        .filter(u => members.filter(m => m.user.uuid === u.uuid).length === 0)
        .map(u => ({
          ...u,
          fullName: fullName(u),
        })))
    },

    createMemberships(memberships) {
      return memberships.filter(m => _.includes(m.allowedEntities, this.config.entityType))
    },

    submitInvite() {
      if (this.inviteForm.userUuid !== null && this.inviteForm.membershipUuid !== null) {
        this.inviteStatus.setPending()
        this.config.putEntityMember(
          this.$route.params.id,
          this.inviteForm.userUuid,
          this.inviteForm.membershipUuid,
        )
          .then(() => {
            this.inviteStatus.setStatus(Status.DEFAULT)
            this.inviteForm = {
              userUuid: null,
              membershipUuid: null,
            }
            this.entity = null
            this.fetchData()
          })
          .catch(error => this.inviteStatus.setErrorFromResponse(error, 'User could not be invited.'))
      }
    },

    updateMember(userUuid, membershipUuid) {
      this.config.putEntityMember(this.entityId, userUuid, membershipUuid)
        .then(() => this.fetchData())
        .catch(error => this.status.setErrorFromResponse(error, 'Unable to update user membership.'))
    },

    removeMember(user) {
      if (window.confirm(`Are you sure you want to remove ${user.firstName} ${user.lastName}?`)) {
        this.config.deleteEntityMember(this.entityId, user.uuid)
          .then(() => this.fetchData())
          .catch(error => this.status.setErrorFromResponse(error, 'Unable to remove user.'))
      }
    },
  },
}
</script>
<style scoped lang="scss">
@import "../scss/variables";

.invite-user, .user-access {
  margin: $space-lg 0 $space-xl 0;
}

.remove-user-action {
  padding: 0 $space-sm;
  margin-left: $space-sm;
}
</style>
