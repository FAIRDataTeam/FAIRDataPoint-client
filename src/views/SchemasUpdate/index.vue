<template>
  <div class="metadata-schemas-import">
    <div>
      <breadcrumbs
        :links="breadcrumbs"
        current="Check for updates"
      />
      <page
        title="Update Metadata Schemas"
        content-only
        small
      >
        <template #content>
          <div v-if="metadataSchemas">
            <schemas-importer :metadata-schemas="metadataSchemas">
              <div class="status-flash__alert status-flash__alert--success">
                All metadata schemas are up to date.
              </div>
            </schemas-importer>
          </div>
          <status-flash
            v-else
            :status="loadingStatus"
          />
        </template>
      </page>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import PrismEditor from 'vue-prism-editor'
import api from '@/api'
import Status from '@/utils/Status'
import Breadcrumbs from '@/components/Breadcrumbs/index.vue'
import Page from '@/components/Page/index.vue'
import SchemasImporter from '@/components/SchemasImporter/index.vue'
import StatusFlash from '@/components/StatusFlash/index.vue'

@Component({
  components: {
    Breadcrumbs, Page, PrismEditor, SchemasImporter, StatusFlash,
  },
})
export default class SchemasUpdate extends Vue {
  loadingStatus: Status = new Status()

  metadataSchemas: any = null

  breadcrumbs = [{
    label: 'Metadata Schemas',
    to: '/schemas',
  }]

  created() {
    this.fetchData()
  }

  @Watch('$route')
  async fetchData() {
    try {
      this.loadingStatus.setPending()
      const response = await api.metadataSchemas.getUpdate()
      this.metadataSchemas = response.data
      this.loadingStatus.setDone()
    } catch (err) {
      this.loadingStatus.setError('Unable to get metadata schemas for update')
    }
  }
}
</script>
