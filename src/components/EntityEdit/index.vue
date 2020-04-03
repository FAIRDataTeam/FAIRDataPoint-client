<template>
  <div>
    <breadcrumbs
      v-if="breadcrumbs !== null"
      :links="breadcrumbs"
      current="Edit"
    />
    <status-flash :status="status" />
    <page
      v-if="graph !== null"
      :title="`Edit ${entityTitle}`"
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
          :skipped-fields="skippedFields"
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
import ShaclForm from '@/components/ShaclForm/index.vue'
import Status from '@/utils/Status'
import Breadcrumbs from '@/components/Breadcrumbs/index.vue'
import FormGenerator from '@/components/FormGenerator/index.vue'
import Page from '@/components/Page/index.vue'
import StatusFlash from '@/components/StatusFlash/index.vue'
import Graph from '@/rdf/Graph'
import { DCT } from '@/rdf/namespaces'
import permissions from '@/utils/permissions'
import { parseValidationReport, ValidationReport } from '@/components/ShaclForm/ValidationReport'

@Component({
  components: {
    Breadcrumbs,
    FormGenerator,
    Page,
    StatusFlash,
    ShaclForm,
  },
})
export default class EntityEdit extends Vue {
  @Prop({ required: true })
  readonly config: any

  breadcrumbs: any = null

  status: Status = new Status()

  graph: any = null

  entityTitle: any = null

  shacl: any = null

  validationReport : ValidationReport = {}


  get entityId(): string {
    return this.$route.params.id
  }

  get isAdmin(): boolean {
    return this.$store.getters['auth/isAdmin']
  }

  get subject() {
    return this.config.getSubject(this.entityId)
  }

  get skippedFields() {
    return _.get(this.config, 'skippedFields', [])
  }

  created(): void {
    this.fetchData()
  }

  @Watch('$route')
  async fetchData(): Promise<void> {
    try {
      this.status.setPending()

      const requests = [
        this.config.api.get(this.entityId),
        this.config.api.getSpec(),
        this.config.api.getMembership(this.entityId),
      ]

      const [entity, spec, membership] = await axios.all(requests)

      if (this.isAdmin || permissions.hasWrite(membership.data)) {
        this.shacl = spec.data
        this.graph = new Graph(entity.data, this.subject)
        this.entityTitle = this.graph.findOne(DCT('title'))
        this.breadcrumbs = this.config.createBreadcrumbs(this.graph)
        this.status.setDone()
      } else {
        await this.$router.replace(this.config.toUrl(this.entityId))
      }
    } catch (error) {
      this.status.setErrorFromResponse(error, 'Unable to get entity data.')
    }
  }

  async onSubmit(turtle: string): Promise<void> {
    try {
      await this.config.api.put(this.entityId, turtle)
      await this.$router.push(this.config.toUrl(this.entityId))
    } catch (error) {
      this.validationReport = parseValidationReport(error.response.data)
      this.status.setError('Unable to update entity data.')
      window.scrollTo(0, 0)
    }
  }
}
</script>
