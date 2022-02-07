<template>
  <div class="metadata-schemas-import">
    <div>
      <breadcrumbs
        :links="breadcrumbs"
        current="Import"
      />
      <page
        title="Import Metadata Schemas"
        content-only
        small
      >
        <template #content>
          <form
            v-if="!metadataSchemas"
            class="form"
            @submit.prevent="loadShapes"
          >
            <status-flash
              :status="loadingStatus"
              no-loading
            />
            <div
              class="form__group"
            >
              <label for="fdp-url">FDP URL</label>
              <input
                id="fdp-url"
                v-model.trim="fdpUrl"
                placeholder="Insert FDP URL"
                name="fdp-url"
              >
            </div>
            <div>
              <button
                class="btn btn-primary btn-rounded"
                :disabled="loadingStatus.isPending() || fdpUrlEmpty"
                data-cy="load-shapes"
              >
                Load shapes
              </button>
            </div>
          </form>
          <div v-else>
            <schemas-importer :metadata-schemas="metadataSchemas">
              <div class="status-flash__alert">
                There are no metadata schemas to import.
              </div>
            </schemas-importer>
          </div>
        </template>
      </page>
    </div>
  </div>
</template>
<script lang="ts">
import _ from 'lodash'
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
export default class SchemasImport extends Vue {
  loadingStatus: Status = new Status()

  fdpUrl: string = null

  metadataSchemas: any = null

  breadcrumbs = [{
    label: 'Metadata Schemas',
    to: '/schemas',
  }]

  get fdpUrlEmpty() {
    return _.isEmpty(this.fdpUrl)
  }

  async loadShapes() {
    if (!this.fdpUrlEmpty) {
      try {
        this.loadingStatus.setPending()
        const response = await api.metadataSchemas.getImport(this.fdpUrl)
        this.metadataSchemas = response.data
        this.loadingStatus.setDone()
      } catch (err) {
        this.loadingStatus.setError(`Unable to retrieve metadata schemas from ${this.fdpUrl}`)
      }
    }
  }
}
</script>
