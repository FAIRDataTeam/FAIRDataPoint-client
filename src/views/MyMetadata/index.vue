<template>
  <div>
    <page
      title="My Metadata"
      content-only
    >
      <template v-slot:actions>
        <a
          href="#"
          class="btn btn-link"
          @click.prevent="expandAll"
        >
          <fa :icon="['fas', 'angle-double-down']" />
          Expand all
        </a>
        <a
          href="#"
          class="btn btn-link"
          @click.prevent="collapseAll"
        >
          <fa :icon="['fas', 'angle-double-up']" />
          Collapse all
        </a>
      </template>
      <template v-slot:content>
        <status-flash :status="status" />
        <item-tree
          v-if="dashboard && dashboard.length > 0"
          v-model="dashboard"
        />
        <div v-if="dashboard && dashboard.length === 0">
          <p>
            You have no metadata.
          </p>
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
import Status from '../../utils/Status'
import ItemTree from '@/views/MyMetadata/ItemTree.vue'

export default {
  name: 'Dashboard',
  components: {
    ItemTree,
    Page,
    StatusFlash,
  },
  data() {
    return {
      dashboard: null,
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

        const response = await api.repository.getDashboard()
        this.dashboard = response.data
        this.status.setDone()
      } catch (error) {
        this.status.setErrorFromResponse(error, 'Unable to load dashboard.')
      }
    },

    toggleOpen(entity) {
      this.changeOpen(current => (
        current.uri === entity.uri ? !current.open : current.open
      ))
    },

    expandAll() {
      this.changeOpen(() => true)
    },

    collapseAll() {
      this.changeOpen(() => false)
    },

    changeOpen(f) {
      this.dashboard = this.dashboard.map(c => ({
        ...c,
        open: f(c),
        children: c.children.map(d => ({
          ...d,
          open: f(d),
        })),
      }))
    },

    sortByTitle(list) {
      return _.orderBy(list, ['title'], ['asc'])
    },
  },
}
</script>
