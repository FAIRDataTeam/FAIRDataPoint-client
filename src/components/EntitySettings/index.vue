<template>
  <div class="entity-settings">
    <breadcrumbs
      v-if="graph !== null"
      :links="breadcrumbs"
      current="Settings"
    />
    <status-flash :status="status" />
    <page
      v-if="graph !== null"
      :title="`${entity.title} Settings`"
      content-only
    >
      <template #content>
        <h2>Users</h2>

        <div class="entity-settings__section">
          <h3>Invite user</h3>
          <status-flash
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
                <template #option="option">
                  <user-item
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
                data-cy="invite"
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

        <div class="entity-settings__section">
          <h3>Users with access to {{ entity.title }}</h3>
          <div class="item-list">
            <user-item
              v-for="member in members"
              :key="member.user.uuid"
              :user="member.user"
            >
              <template #actions>
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
                  class="text-danger ms-3 p-1"
                  @click="removeMember(member.user)"
                >
                  <fa :icon="['fas', 'user-slash']" />
                </a>
              </template>
            </user-item>
          </div>
        </div>
      </template>
    </page>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import _ from 'lodash'
import axios from 'axios'
import EntityBase from '@/components/EntityBase'
import api from '../../api'
import Breadcrumbs from '../Breadcrumbs/index.vue'
import Page from '../Page/index.vue'
import StatusFlash from '../StatusFlash/index.vue'
import UserItem from '../UserItem/index.vue'
import Status from '../../utils/Status'

export default defineComponent({
  components: {
    Breadcrumbs,
    Page,
    StatusFlash,
    UserItem,
  },
  extends: EntityBase,
  data() {
    return {
      inviteForm: {
        userUuid: null,
        membershipUuid: null,
      } as any,
      inviteStatus: new Status() as Status,
      members: null as any,
      memberships: null as any,
      users: null as any,
    }
  },
  methods: {
    async fetchData(): Promise<void> {
      try {
        this.status.setPending()
        const [entity, meta, members, users, memberships] = await this.loadData()

        this.buildGraph(entity.data)
        this.members = _.orderBy(members.data, ['user.firstName', 'user.lastName'], ['asc'])
        this.users = this.createUsers(users.data, this.members)
        this.memberships = this.createMemberships(memberships.data)
        this.inviteForm.membershipUuid = _.get(this.memberships, '0.uuid')
        this.breadcrumbs = this.config.createBreadcrumbsWithSelf(meta.data.path, this.subject)
        this.status.setDone()
      } catch (error) {
        if (_.get(error, 'response.status') === 403) {
          await this.$router.replace(this.config.toUrl(this.entityId))
        } else {
          this.status.setErrorFromResponse(error, 'Unable to get data.')
        }
      }
    },
    async loadData() {
      return axios.all([
        this.config.api.get(this.entityId),
        this.config.api.getMeta(this.entityId),
        this.config.api.getMembers(this.entityId),
        api.users.getUsers(),
        api.memberships.getMemberships(),
      ])
    },
    createUsers(users: Array<any>, members: Array<any>): Array<any> {
      return _.orderBy(users
        .filter((u) => members.filter((m) => m.user.uuid === u.uuid).length === 0)
        .map((u) => ({
          ...u,
          fullName: `${u.firstName} ${u.lastName}`,
        })), ['firstName', 'lastName'], ['asc'])
    },
    createMemberships(memberships: Array<any>): Array<any> {
      return memberships.filter((m) => _.includes(m.allowedEntities, this.config.uuid))
    },
    async submitInvite(): Promise<void> {
      if (this.inviteForm.userUuid !== null && this.inviteForm.membershipUuid !== null) {
        try {
          this.inviteStatus.setPending()
          await this.config.api.putMember(
            this.$route.params.id,
            this.inviteForm.userUuid,
            this.inviteForm.membershipUuid,
          )

          this.inviteStatus.setStatus(Status.DEFAULT)
          this.inviteForm = {
            userUuid: null,
            membershipUuid: null,
          }
          this.graph = null
          this.fetchData()
        } catch (error) {
          this.inviteStatus.setErrorFromResponse(error, 'User could not be invited.')
        }
      }
    },
    async updateMember(userUuid: string, membershipUuid: string): Promise<void> {
      try {
        await this.config.api.putMember(this.entityId, userUuid, membershipUuid)
        this.fetchData()
      } catch (error) {
        this.status.setErrorFromResponse(error, 'Unable to update user membership.')
      }
    },
    async removeMember(user: any): Promise<void> {
      if (window.confirm(`Are you sure you want to remove ${user.firstName} ${user.lastName}?`)) {
        try {
          await this.config.api.deleteMember(this.entityId, user.uuid)
          this.fetchData()
        } catch (error) {
          this.status.setErrorFromResponse(error, 'Unable to remove user.')
        }
      }
    },
  },
})
</script>
