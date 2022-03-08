<template>
  <div>
    <page
      :title="'FAIR Data Points'"
      content-only
    >
      <template #content>
        <status-flash :status="status" />
        <template v-if="data">
          <status-flash :status="actionStatus" />
          <div class="table-filter">
            <div class="filter-name">
              Filter:
            </div>
            <div class="filter-content">
              <router-link
                v-for="state in states"
                :key="state"
                :class="`btn btn-outline-${badgeClass(state)} ${filter === state ? 'active' : ''}`"
                :to="filterUrl(state)"
              >
                {{ stateToReadable(state) }}
                <span class="badge badge-light">{{ info.entriesCount[state] }}</span>
              </router-link>
            </div>
          </div>
          <table class="table table-striped">
            <thead>
              <tr>
                <th>
                  Endpoint
                  <router-link
                    :class="{ 'sort-link': true, 'active': sort === 'clientUrl,asc' }"
                    :to="sortUrl('clientUrl,asc')"
                  >
                    ▲
                  </router-link>
                  <router-link
                    :class="{ 'sort-link': true, 'active': sort === 'clientUrl,desc' }"
                    :to="sortUrl('clientUrl,desc')"
                  >
                    ▼
                  </router-link>
                </th>
                <th>
                  Registration
                  <router-link
                    :class="{ 'sort-link': true, 'active': sort === 'registrationTime,asc' }"
                    :to="sortUrl('registrationTime,asc')"
                  >
                    ▲
                  </router-link>
                  <router-link
                    :class="{ 'sort-link': true, 'active': sort === 'registrationTime,desc' }"
                    :to="sortUrl('registrationTime,desc')"
                  >
                    ▼
                  </router-link>
                </th>
                <th>
                  Modification
                  <router-link
                    :class="{ 'sort-link': true, 'active': sort === 'modificationTime,asc' }"
                    :to="sortUrl('modificationTime,asc')"
                  >
                    ▲
                  </router-link>
                  <router-link
                    :class="{ 'sort-link': true, 'active': sort === 'modificationTime,desc' }"
                    :to="sortUrl('modificationTime,desc')"
                  >
                    ▼
                  </router-link>
                </th>
                <th>
                  Status
                </th>
                <th v-if="isAdmin" />
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="fdp in data.content"
                :key="fdp.uuid"
              >
                <td>
                  <router-link :to="`/entry/${fdp.uuid}`">
                    {{ fdp.clientUrl }}
                  </router-link>
                </td>
                <td>{{ formatDateTime(fdp.registrationTime) }}</td>
                <td>{{ formatDateTime(fdp.modificationTime) }}</td>
                <td>
                  <span :class="`badge badge-${badgeClass(fdp.state)}`">
                    {{ fdp.state }}
                  </span>
                </td>
                <td v-if="isAdmin">
                  <a
                    class="mr-3"
                    :class="{ 'disabled': actionStatus.isPending() }"
                    title="Sync FDP"
                    href=""
                    @click.prevent="syncFdp(fdp)"
                  >
                    <fa :icon="['fas', 'sync-alt']" />
                  </a>
                  <a
                    class="color-danger"
                    :class="{ 'disabled': actionStatus.isPending() }"
                    title="Remove FDP"
                    href=""
                    @click.prevent="removeFdp(fdp)"
                  >
                    <fa :icon="['far', 'trash-alt']" />
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
          <pagination
            :current-page="page - 1"
            :last-page="data.totalPages - 1"
            @pageSelected="openPage"
          />
        </template>
      </template>
    </page>
  </div>
</template>
<script lang="ts">
import _ from 'lodash'
import { Component, Vue, Watch } from 'vue-property-decorator'
import axios from 'axios'
import moment from 'moment'
import api from '@/api'
import Page from '@/components/Page/index.vue'
import Pagination from '@/components/Pagination/index.vue'
import config from '@/config'
import Status from '@/utils/Status'
import StatusFlash from '@/components/StatusFlash/index.vue'
import { stateClass } from '@/utils/fdpIndex'

@Component({ components: { Page, Pagination, StatusFlash } })
export default class Index extends Vue {
  data: any = null

  info: any = null

  filter: string = 'ACTIVE'

  sort: string = 'modificationTime,desc'

  page: number = 1

  status: Status = new Status()

  actionStatus: Status = new Status()

  states: string[] = ['ALL', 'ACTIVE', 'INACTIVE', 'UNREACHABLE', 'INVALID', 'UNKNOWN']

  get user() {
    return this.$store.getters['auth/user']
  }

  get isAdmin() {
    return _.get(this.user, 'role') === 'ADMIN'
  }

  created(): void {
    this.init()
  }

  sortUrl(sort: string): string {
    return `/?state=${this.filter}&sort=${sort}`
  }

  filterUrl(filter: string): string {
    return `/?state=${filter}&sort=${this.sort}`
  }

  formatDateTime(value): string {
    return moment(value).format(config.dateTimeFormat)
  }

  stateToReadable(state) {
    return _.startCase(_.toLower(state))
  }

  badgeClass(state) {
    return stateClass(state)
  }

  openPage(page) {
    this.$router.push(`/?state=${this.filter}&sort=${this.sort}&page=${page + 1}`)
  }

  @Watch('$route')
  async init() {
    this.filter = _.get(this.$route.query, 'state', this.filter) as string
    this.sort = _.get(this.$route.query, 'sort', this.sort) as string
    this.page = parseInt(_.get(this.$route.query, 'page', this.page) as string, 10)

    try {
      this.status.setPending()
      this.data = null

      const requests = axios.all([
        api.fdpIndex.getEntries({ state: this.filter, sort: this.sort, page: this.page }),
        api.fdpIndex.getInfo(),
      ])

      const [dataResponse, infoResponse] = await requests

      this.data = dataResponse.data
      this.info = infoResponse.data

      this.status.setDone()
    } catch (error) {
      this.status.setError('Unable to get FAIR Data Points.')
    }
  }

  async syncFdp(entry) {
    try {
      this.actionStatus.setPending()
      await api.fdpIndex.ping(entry.clientUrl)
      await this.init()
      this.actionStatus.setDone(`Syncing of "${entry.clientUrl}" started!`)
    } catch (error) {
      this.actionStatus.setError(`Unable to sync "${entry.clientUrl}"`)
    }
  }

  async removeFdp(entry) {
    if (window.confirm(`Are you sure you want to remove "${entry.clientUrl}"?`)) {
      try {
        this.actionStatus.setPending()
        await api.fdpIndex.deleteEntry(entry.uuid)
        await this.init()
        this.actionStatus.setDone(`Successfully removed "${entry.clientUrl}"`)
      } catch (error) {
        this.actionStatus.setError(`Unable to remove "${entry.clientUrl}"`)
      }
    }
  }
}
</script>
