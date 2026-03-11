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
      <template #content>
        <status-flash :status="submitStatus">
          <template
            v-if="rawError !== null"
            #extra-content
          >
            <div class="mt-2">
              <a
                v-b-toggle.raw-error
                class="collapse-link"
              >
                View report
                <fa
                  :icon="['fas', 'angle-down']"
                  class="rotate-icon"
                />
              </a>

              <b-collapse id="raw-error">
                <prism-editor
                  v-model="rawError"
                  language="turtle"
                  :readonly="true"
                  class="mt-2"
                />
              </b-collapse>
            </div>
          </template>
        </status-flash>
        <shacl-form
          :rdf="graph.store"
          :shacl="shacl"
          :target-classes="config.targetClasses"
          :subject="subject"
          :validation-report="validationReport"
          :submit-status="submitStatus"
          :fill-defaults="true"
          @submit="onSubmit"
        />
      </template>
    </page>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import axios from 'axios'
import _ from 'lodash'
import * as $rdf from 'rdflib'
import PrismEditor from '@/components/PrismEditor/index.vue'
import ShaclForm from '@/components/ShaclForm/index.vue'
import Breadcrumbs from '@/components/Breadcrumbs/index.vue'
import Page from '@/components/Page/index.vue'
import StatusFlash from '@/components/StatusFlash/index.vue'
import Graph from '@/rdf/Graph'
import { DCT } from '@/rdf/namespaces'
import config from '@/config'
import {
  parseValidationReport,
  ValidationReport,
} from '@/components/ShaclForm/Parser/ValidationReport'
import { EntityConfig } from '@/entity/EntityConfig'
import EntityBase from '@/components/EntityBase'
import Status from '@/utils/Status'

export default defineComponent({
  components: {
    Breadcrumbs,
    Page,
    PrismEditor,
    StatusFlash,
    ShaclForm,
  },
  extends: EntityBase,
  props: {
    parentConfig: { type: Object as PropType<EntityConfig>, required: true },
  },
  data() {
    return {
      shacl: null as any,
      validationReport: {} as ValidationReport,
      submitStatus: new Status() as Status,
      rawError: null as string | null,
    }
  },
  computed: {
    createName() {
      return `Create ${this.config.urlPrefix}`
    },
    subject() {
      return `${config.persistentURL()}/new`
    },
    isPartOf() {
      return this.parentConfig.subject(this.entityId)
    },
  },
  methods: {
    async fetchData(): Promise<void> {
      try {
        this.status.setPending()

        const [spec, meta] = await this.loadData()

        if (this.isAdmin || this.parentConfig.canCreateChild(this.isAuthenticated, meta.data)) {
          this.shacl = spec.data
          this.graph = new Graph('', this.subject)
          this.graph.store.add($rdf.namedNode(this.subject), DCT('isPartOf'), $rdf.namedNode(this.isPartOf), null)
          this.breadcrumbs = this.parentConfig.createBreadcrumbsWithSelf(
            meta.data.path,
            this.parentConfig.subject(this.entityId),
          )
          this.status.setDone()
        } else {
          await this.$router.replace(this.parentConfig.toUrl(this.entityId))
        }
      } catch (error) {
        this.status.setErrorFromResponse(error, 'Unable to get metadata.')
      }
    },
    async loadData() {
      return axios.all([
        this.config.api.getSpec(),
        this.parentConfig.api.getMeta(this.entityId),
      ])
    },
    async onSubmit(turtle: string): Promise<void> {
      try {
        this.submitStatus.setPending()
        const response = await this.config.api.post(turtle)
        const entityId = _.last(_.get(response, 'headers.location', '').split('/'))
        await this.$router.push(this.config.toUrl(entityId))
      } catch (error) {
        this.rawError = _.get(error, 'response.data', null)
        const validationReport = parseValidationReport(this.rawError)
        const focusNodeReport = _.first(Object.values(validationReport)) || {}
        this.validationReport = { [this.subject]: focusNodeReport }
        this.submitStatus.setError('Unable to save entity data.')
        window.scrollTo(0, 0)
      }
    },
  },
})
</script>
