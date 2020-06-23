<template>
  <div>
    <breadcrumbs
      v-if="breadcrumbs !== null"
      :links="breadcrumbs"
      :current="createName"
    />
    <status-flash :status="status" />
    <status-flash :status="submitStatus" />
    <page
      v-if="graph !== null"
      :title="createName"
      content-only
      small
    >
      <template v-slot:content>
        <shacl-form
          :rdf="graph.store"
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
import { Component, Prop } from 'vue-property-decorator'
import axios from 'axios'
import _ from 'lodash'
import * as $rdf from 'rdflib'
import ShaclForm from '@/components/ShaclForm/index.vue'
import Breadcrumbs from '@/components/Breadcrumbs/index.vue'
import Page from '@/components/Page/index.vue'
import StatusFlash from '@/components/StatusFlash/index.vue'
import Graph from '@/rdf/Graph'
import { DCT } from '@/rdf/namespaces'
import config from '@/config'
import { parseValidationReport, ValidationReport } from '@/components/ShaclForm/Parser/ValidationReport'
import { EntityConfig } from '@/entity/EntityConfig'
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
export default class EntityCreate extends EntityBase {
  @Prop({ required: true })
  readonly parentConfig: EntityConfig

  shacl: any = null

  validationReport: ValidationReport = {}

  submitStatus : Status = new Status()

  get createName() {
    return `Create ${this.config.urlPrefix}`
  }

  get subject() {
    return `${config.persistentURL()}/new`
  }

  get isPartOf() {
    return this.parentConfig.subject(this.entityId)
  }

  async fetchData(): Promise<void> {
    try {
      this.status.setPending()

      const [spec, parent, meta] = await this.loadData()

      if (this.isAdmin || this.parentConfig.canCreateChild(this.isAuthenticated, meta.data)) {
        this.shacl = spec.data
        this.graph = new Graph('', this.subject)
        this.graph.store.add($rdf.namedNode(this.subject), DCT('isPartOf'), $rdf.namedNode(this.isPartOf), null)
        this.createBreadcrumbs(parent.data)
        this.status.setDone()
      } else {
        await this.$router.replace(this.parentConfig.toUrl(this.entityId))
      }
    } catch (error) {
      this.status.setErrorFromResponse(error, 'Unable to get metadata.')
    }
  }

  async loadData() {
    return axios.all([
      this.config.api.getSpec(),
      this.parentConfig.api.getExpanded(this.entityId),
      this.parentConfig.api.getMeta(this.entityId),
    ])
  }

  createBreadcrumbs(data) {
    const graph = new Graph(data, this.isPartOf)
    this.breadcrumbs = this.parentConfig.createBreadcrumbsWithSelf(graph, this.entityId)
  }

  async onSubmit(turtle: string): Promise<void> {
    try {
      this.submitStatus.setPending()
      const response = await this.config.api.post(turtle)
      const entityId = _.last(_.get(response, 'headers.location', '').split('/'))
      await this.$router.push(this.config.toUrl(entityId))
    } catch (error) {
      const validationReport = parseValidationReport(_.get(error, 'response.data', ''))
      const focusNodeReport = _.first(Object.values(validationReport)) || {}
      this.validationReport = { [this.subject]: focusNodeReport }
      this.submitStatus.setError('Unable to save entity data.')
      window.scrollTo(0, 0)
    }
  }
}
</script>
