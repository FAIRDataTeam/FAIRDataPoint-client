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
      <template v-slot:content>
        <status-flash :status="status" />
        <template v-if="fdp">
          <div class="entry-header">
            <h2 class="entry-title">
              FDP <a
                :href="fdp.clientUrl"
                target="_blank"
              >{{ fdp.clientUrl }}</a>
            </h2>
            <span :class="`badge badge-${badgeClass(fdp.state)}`">
              {{ fdp.state }}
            </span>
          </div>
          <hr>
          <h2>Timestamps</h2>
          <table class="table table-borderless">
            <tbody>
              <tr>
                <th>Registered <span class="text-muted">(first contact)</span></th>
                <td>{{ formatDateTime(fdp.registrationTime) }}</td>
              </tr>
              <tr>
                <th>Modified <span class="text-muted">(last contact)</span></th>
                <td>{{ formatDateTime(fdp.modificationTime) }}</td>
              </tr>
              <tr>
                <th>Verified <span class="text-muted">(last metadata retrieval)</span></th>
                <td>{{ formatDateTime(fdp.lastRetrievalTime) }}</td>
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
              <tr>
                <th>Title</th>
                <td>{{ fdp.currentMetadata.metadata.title }}</td>
              </tr>
              <tr>
                <th>Version</th>
                <td>{{ fdp.currentMetadata.metadata.version }}</td>
              </tr>
              <tr>
                <th>Publisher</th>
                <td>
                  <a
                    :href="fdp.currentMetadata.metadata.publisher"
                    target="_blank"
                  >{{ fdp.currentMetadata.metadata.publisherName }}</a>
                </td>
              </tr>
              <tr>
                <th>Description</th>
                <td>{{ fdp.currentMetadata.metadata.description }}</td>
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
import _ from 'lodash'
import { Component, Vue, Watch } from 'vue-property-decorator'
import moment from 'moment'
import api from '../../api'
import Breadcrumbs from '../../components/Breadcrumbs/index.vue'
import Page from '@/components/Page/index.vue'
import config from '@/config'
import Status from '@/utils/Status'
import StatusFlash from '@/components/StatusFlash/index.vue'
import { stateClass } from '@/utils/fdpIndex'

@Component({ components: { Breadcrumbs, Page, StatusFlash } })
export default class IndexDetail extends Vue {
  fdp: any = null

  status: Status = new Status()

  get breadcrumbs() {
    return [{
      label: 'FAIR Data Point Index',
      to: '/',
    }]
  }

  get title() {
    return _.get(this.fdp, 'clientUrl')
  }

  created(): void {
    this.init()
  }

  badgeClass(state) {
    return stateClass(state)
  }

  formatDateTime(value): string {
    return moment(value).format(config.dateTimeFormat)
  }

  @Watch('$route')
  async init() {
    try {
      this.status.setPending()
      const response = await api.indexEntries.getEntry(this.$route.params.id)
      this.fdp = response.data
      this.status.setDone()
    } catch (error) {
      this.status.setError('Unable to get FAIR Data Point.')
    }
  }
}
</script>
