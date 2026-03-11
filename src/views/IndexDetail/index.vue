<template>
  <div class="index-detail">
    <breadcrumbs
      v-if="fdp"
      :links="breadcrumbs"
      :current="title"
    />
    <page
      content-only
      small
    >
      <template #content>
        <status-flash :status="status" />
        <template v-if="fdp">
          <status-flash
            :status="permitStatus"
            no-loading
          />
          <div class="entry-header">
            <h2 class="entry-title">
              FDP <a
                :href="fdp.clientUrl"
                target="_blank"
              >{{ fdp.clientUrl }}</a>
            </h2>
          </div>
          <div>
            <span :class="`badge badge-${badgeClass(fdp.state)}`">
              {{ fdp.state }}
            </span>
            <b-dropdown
              v-if="user && user.role === 'ADMIN'"
              variant="link"
            >
              <template #button-content>
                {{ fdp.permit }}
              </template>
              <b-dropdown-header>
                Permit
              </b-dropdown-header>
              <b-dropdown-item @click="changePermit('ACCEPTED')">
                Accepted
              </b-dropdown-item>
              <b-dropdown-item @click="changePermit('REJECTED')">
                Rejected
              </b-dropdown-item>
            </b-dropdown>
          </div>
          <hr>
          <h2>Timestamps</h2>
          <table class="table table-borderless">
            <tbody>
              <tr>
                <th>Registered <span class="text-muted">(first contact)</span></th>
                <td>{{ formatDateTime(fdp.createdAt) }}</td>
              </tr>
              <tr>
                <th>Modified <span class="text-muted">(last contact)</span></th>
                <td>{{ formatDateTime(fdp.updatedAt) }}</td>
              </tr>
              <tr>
                <th>Verified <span class="text-muted">(last metadata retrieval)</span></th>
                <td>{{ formatDateTime(fdp.lastRetrievalAt) }}</td>
              </tr>
            </tbody>
          </table>
          <hr>
          <h2>Repository metadata</h2>
          <table class="table table-borderless">
            <tbody>
              <tr>
                <th>Repository URI</th>
                <td>
                  <a
                    :href="fdp.clientUrl"
                    target="_blank"
                  >{{ fdp.clientUrl }}</a>
                </td>
              </tr>
              <tr v-if="metadataTitle">
                <th>Title</th>
                <td>{{ metadataTitle }}</td>
              </tr>
              <tr v-if="metadataVersion">
                <th>Version</th>
                <td>{{ metadataVersion }}</td>
              </tr>
              <tr v-if="metadataPublisher && metadataPublisherName">
                <th>Publisher</th>
                <td>
                  <a
                    :href="metadataPublisher"
                    target="_blank"
                  >{{ metadataPublisherName }}</a>
                </td>
              </tr>
              <tr v-if="metadataDescription">
                <th>Description</th>
                <td>{{ metadataDescription }}</td>
              </tr>
            </tbody>
          </table>
          <hr>
          <h2>Events</h2>
          <p>Last 10 events related to this entry:</p>
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Type</th>
                <th>Created</th>
                <th>Finished</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="event in fdp.events"
                :key="event.uuid"
              >
                <td>{{ event.type }}</td>
                <td>{{ formatDateTime(event.created) }}</td>
                <td>{{ formatDateTime(event.finished) }}</td>
              </tr>
            </tbody>
          </table>
        </template>
      </template>
    </page>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import _ from 'lodash'
import moment from 'moment'
import Page from '@/components/Page/index.vue'
import config from '@/config'
import Status from '@/utils/Status'
import StatusFlash from '@/components/StatusFlash/index.vue'
import { stateClass } from '@/utils/fdpIndex'
import Breadcrumbs from '../../components/Breadcrumbs/index.vue'
import api from '../../api'

export default defineComponent({
  components: { Breadcrumbs, Page, StatusFlash },
  data() {
    return {
      fdp: null,
      status: new Status(),
      permitStatus: new Status(),
    }
  },
  computed: {
    breadcrumbs() {
      return [{
        label: 'FAIR Data Point Index',
        to: '/',
      }]
    },
    user() {
      return this.$store.getters['auth/user']
    },
    title() {
      return _.get(this.fdp, 'clientUrl')
    },
    metadataTitle() {
      return _.get(this.fdp, 'currentMetadata.metadata.title')
    },
    metadataVersion() {
      return _.get(this.fdp, 'currentMetadata.metadata.version')
    },
    metadataPublisher() {
      return _.get(this.fdp, 'currentMetadata.metadata.publisher')
    },
    metadataPublisherName() {
      return _.get(this.fdp, 'currentMetadata.metadata.publisherName')
    },
    metadataDescription() {
      return _.get(this.fdp, 'currentMetadata.metadata.description')
    },
  },
  watch: {
    $route: 'init',
  },
  created(): void {
    this.init()
  },
  methods: {
    badgeClass(state) {
      return stateClass(state)
    },
    formatDateTime(value): string {
      return moment(value).format(config.dateTimeFormat)
    },
    async init() {
      try {
        this.status.setPending()
        const response = await api.fdpIndex.getEntry(this.$route.params.id)
        this.fdp = response.data
        this.status.setDone()
      } catch (error) {
        this.status.setError('Unable to get FAIR Data Point.')
      }
    },
    async changePermit(permit) {
      try {
        this.permitStatus.setPending()
        await api.fdpIndex.putEntry(this.fdp.uuid, { permit })
        this.fdp.permit = permit
        this.permitStatus.setDone()
      } catch (error) {
        this.permitStatus.setError('Unable to change permit')
      }
    },
  },
})
</script>
