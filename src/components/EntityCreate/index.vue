<template>
  <div>
    <breadcrumbs
      v-if="breadcrumbs !== null"
      :links="breadcrumbs"
      :current="createName"
    />
    <status-flash :status="status" />
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
          :shape="config.shape"
          :subject="subject"
          :filter="config.filter"
          :validation-report="validationReport"
          @submit="onSubmit"
        />
      </template>
    </page>
  </div>
</template>
<script lang="ts">
import {
  Component, Prop, Vue, Watch,
} from 'vue-property-decorator'
import axios from 'axios'
import _ from 'lodash'
import * as $rdf from 'rdflib'
import ShaclForm from '@/components/ShaclForm/index.vue'
import Status from '@/utils/Status'
import Breadcrumbs from '@/components/Breadcrumbs/index.vue'
import Page from '@/components/Page/index.vue'
import StatusFlash from '@/components/StatusFlash/index.vue'
import Graph from '@/rdf/Graph'
import { DCT } from '@/rdf/namespaces'
import config from '@/config'
import { parseValidationReport, ValidationReport } from '@/components/ShaclForm/ValidationReport'


@Component({
  components: {
    Breadcrumbs,
    Page,
    StatusFlash,
    ShaclForm,
  },
})
export default class EntityCreate extends Vue {
  @Prop({ required: true })
  readonly config: any

  breadcrumbs: any = null

  status: Status = new Status()

  graph: Graph = null

  shacl: any = null

  validationReport: ValidationReport = {}

  get createName() {
    return this.config.createName
  }

  get parentEntityId(): string {
    return this.$route.params.id
  }

  get isAdmin(): boolean {
    return this.$store.getters['auth/isAdmin']
  }

  get subject() {
    return `${config.apiURL}/new`
  }

  get isPartOf() {
    return this.config.isPartOf(this.parentEntityId)
  }

  created(): void {
    this.fetchData()
  }

  @Watch('$route')
  async fetchData(): Promise<void> {
    try {
      this.status.setPending()

      const requests = [
        this.config.api.getSpec(),
        this.config.parentApi.get(this.parentEntityId),
        this.config.parentApi.getMembership(this.parentEntityId),
      ]

      const [spec, parent, membership] = await axios.all(requests)

      if (this.isAdmin || this.config.isAllowed(membership.data)) {
        this.shacl = spec.data
        this.graph = new Graph('', this.subject)
        this.graph.store.add($rdf.namedNode(this.subject), DCT('isPartOf'), $rdf.namedNode(this.isPartOf), null)
        this.createBreadcrumbs(parent.data)
        this.status.setDone()
      } else {
        await this.$router.replace(this.config.getParentUrl(this.isPartOf))
      }
    } catch (error) {
      this.status.setErrorFromResponse(error, 'Unable to get metadata.')
    }
  }

  createBreadcrumbs(data) {
    const graph = new Graph(data, this.isPartOf)
    this.breadcrumbs = this.config.createBreadcrumbs(graph)
  }

  async onSubmit(turtle: string): Promise<void> {
    try {
      const response = await this.config.api.post(turtle)
      const entityUuid = _.last(_.get(response, 'headers.location', '').split('/'))
      await this.$router.push(this.config.getEntityUrl(entityUuid))
    } catch (error) {
      const validationReport = parseValidationReport(_.get(error, 'response.data', ''))
      const focusNodeReport = _.first(Object.values(validationReport)) || {}
      this.validationReport = { [this.subject]: focusNodeReport }
      this.status.setError('Unable to save entity data.')
      window.scrollTo(0, 0)
    }
  }
}
</script>
