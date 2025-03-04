<template>
  <div>
    <status-flash :status="actionStatus" />
    <div class="table-filter">
      <div class="filter-name">
        Filter:
      </div>
      <div class="filter-content">
        <a
          v-for="state in states"
          :key="state"
          :class="`btn btn-outline-${badgeClass(state)} ${filter === state ? 'active' : ''}`"
          @click.prevent="filterData(state)"
        >
          {{ stateToReadable(state) }}
          <span
            v-if="info"
            class="badge badge-light"
          >{{ info.entriesCount[state] }}</span>
        </a>
      </div>
    </div>
    <div
      v-if="isAdmin"
      class="table-filter"
    >
      <div class="filter-name">
        Permit:
      </div>
      <div class="filter-content">
        <a
          v-for="permit in permits"
          :key="permit"
          :class="`btn btn-outline-secondary ${permitFilter === permit ? 'active' : ''}`"
          @click.prevent="filterPermit(permit)"
        >
          {{ stateToReadable(permit) }}
        </a>
      </div>
    </div>
    <status-flash :status="status" />
    <template v-if="data">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>
              Endpoint
              <a
                :class="{ 'sort-link': true, 'active': sort === 'clientUrl,asc' }"
                @click.prevent="sortData('clientUrl,asc')"
              >
                ▲
              </a>
              <a
                :class="{ 'sort-link': true, 'active': sort === 'clientUrl,desc' }"
                @click.prevent="sortData('clientUrl,desc')"
              >
                ▼
              </a>
            </th>
            <th>
              Registration
              <a
                :class="{ 'sort-link': true, 'active': sort === 'createdAt,asc' }"
                @click.prevent="sortData('createdAt,asc')"
              >
                ▲
              </a>
              <a
                :class="{ 'sort-link': true, 'active': sort === 'createdAt,desc' }"
                @click.prevent="sortData('createdAt,desc')"
              >
                ▼
              </a>
            </th>
            <th>
              Modification
              <a
                :class="{ 'sort-link': true, 'active': sort === 'updatedAt,asc' }"
                @click.prevent="sortData('updatedAt,asc')"
              >
                ▲
              </a>
              <a
                :class="{ 'sort-link': true, 'active': sort === 'updatedAt,desc' }"
                @click.prevent="sortData('updatedAt,desc')"
              >
                ▼
              </a>
            </th>
            <th>
              Status
            </th>
            <th v-if="isAdmin">
              Permit
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
            <td>{{ formatDateTime(fdp.createdAt) }}</td>
            <td>{{ formatDateTime(fdp.updatedAt) }}</td>
            <td>
              <span :class="`badge badge-${badgeClass(fdp.state)}`">
                {{ fdp.state }}
              </span>
            </td>
            <td v-if="isAdmin">
              {{ fdp.permit }}
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

  permitFilter: string = 'ACCEPTED'

  sort: string = 'updatedAt,desc'

  page: number = 1

  status: Status = new Status()

  actionStatus: Status = new Status()

  states: string[] = ['ALL', 'ACTIVE', 'INACTIVE', 'UNREACHABLE', 'INVALID', 'UNKNOWN']

  permits: string[] = ['ALL', 'ACCEPTED', 'REJECTED', 'PENDING']

  get user() {
    return this.$store.getters['auth/user']
  }

  get isAdmin() {
    return _.get(this.user, 'role') === 'ADMIN'
  }

  created(): void {
    this.init()
  }

  async filterData(filter: string) {
    this.filter = filter
    this.page = 0
    this.updateUrl()

    await this.loadFdps()
  }

  async filterPermit(permitFilter: string) {
    this.permitFilter = permitFilter
    this.page = 0
    this.updateUrl()

    await this.loadFdps()
  }

  async sortData(sort: string) {
    this.sort = sort
    this.page = 0
    this.updateUrl()

    await this.loadFdps()
  }

  updateUrl(): void {
    window.history.pushState(null, '', this.createUrl())
  }

  createUrl(page = null): string {
    const pageNumber = page || this.page
    const permitFilter = this.isAdmin ? `&permit=${this.permitFilter}` : ''
    return `/?state=${this.filter}${permitFilter}&sort=${this.sort}&page=${pageNumber}`
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
    const url = this.createUrl(page + 1)
    this.$router.push(url)
  }

  @Watch('$route')
  async init() {
    this.filter = _.get(this.$route.query, 'state', this.filter) as string
    this.sort = _.get(this.$route.query, 'sort', this.sort) as string
    this.page = parseInt(_.get(this.$route.query, 'page', this.page) as string, 10)

    try {
      this.status.setPending()
      const infoResponse = await api.fdpIndex.getInfo()
      this.info = infoResponse.data
      await this.loadFdps()
    } catch (error) {
      this.status.setError('Unable to get FAIR Data Points.')
    }
  }

  async loadFdps() {
    try {
      this.actionStatus.setDone()

      this.status.setPending()
      this.data = null

      const dataResponse = await api.fdpIndex.getEntries({
        state: this.filter,
        permit: this.permitFilter,
        sort: this.sort,
        page: this.page,
      })

      this.data = dataResponse.data

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
