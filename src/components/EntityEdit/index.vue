<template>
  <div>
    <breadcrumbs
      v-if="breadcrumbs !== null"
      :links="breadcrumbs"
      current="Edit"
    />
    <status-flash :status="status" />
    <status-flash :status="submitStatus" />
    <page
      v-if="simpleGraph !== null"
      :title="`Edit ${entity.title}`"
      content-only
      small
    >
      <template v-slot:content>
        <shacl-form
          :rdf="simpleGraph.store"
          :shacl="shacl"
          :target-classes="config.targetClasses"
          :subject="subject"
          :validation-report="validationReport"
          :submit-status="submitStatus"
          @submit="onSubmit"
        />
      </template>
    </page>
  </div>
</template>
<script lang="ts">
import { Component } from 'vue-property-decorator'
import axios from 'axios'
import ShaclForm from '@/components/ShaclForm/index.vue'
import Breadcrumbs from '@/components/Breadcrumbs/index.vue'
import Page from '@/components/Page/index.vue'
import StatusFlash from '@/components/StatusFlash/index.vue'
import Graph from '@/rdf/Graph'
import permissions from '@/utils/permissions'
import { parseValidationReport, ValidationReport } from '@/components/ShaclForm/Parser/ValidationReport'
import EntityBase from '@/components/EntityBase'
import Status from '@/utils/Status'


@Component({
  components: {
    Breadcrumbs,
    Page,
    StatusFlash,
    ShaclForm,
  },
})
export default class EntityEdit extends EntityBase {
  simpleGraph: any = null

  shacl: any = null

  validationReport : ValidationReport = {}

  submitStatus : Status = new Status()

  async fetchData(): Promise<void> {
    try {
      this.status.setPending()
      const [entity, expandedEntity, spec, meta] = await this.loadData()

      if (this.isAdmin || permissions.hasWrite(meta.data)) {
        this.buildGraph(expandedEntity.data)
        this.shacl = spec.data
        this.simpleGraph = new Graph(entity.data, this.subject)
        this.breadcrumbs = this.config.createBreadcrumbsWithSelf(this.graph, this.entityId)
        this.status.setDone()
      } else {
        await this.$router.replace(this.config.toUrl(this.entityId))
      }
    } catch (error) {
      this.status.setErrorFromResponse(error, 'Unable to get entity data.')
    }
  }

  async loadData() {
    return axios.all([
      this.config.api.get(this.entityId),
      this.config.api.getExpanded(this.entityId),
      this.config.api.getSpec(),
      this.config.api.getMeta(this.entityId),
    ])
  }

  async onSubmit(turtle: string): Promise<void> {
    try {
      this.submitStatus.setPending()
      await this.config.api.put(this.entityId, turtle)
      await this.$router.push(this.config.toUrl(this.entityId))
    } catch (error) {
      this.validationReport = parseValidationReport(error.response.data)
      this.submitStatus.setError('Unable to update entity data.')
      window.scrollTo(0, 0)
    }
  }
}
</script>
