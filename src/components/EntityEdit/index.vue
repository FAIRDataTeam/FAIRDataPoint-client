<template>
  <div>
    <breadcrumbs
      v-if="breadcrumbs !== null"
      :links="breadcrumbs"
      current="Edit"
    />
    <status-flash :status="status" />
    <page
      v-if="simpleGraph !== null"
      :title="`Edit ${entity.title}`"
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
import { defineComponent } from 'vue'
import axios from 'axios'
import PrismEditor from '@/components/PrismEditor/index.vue'
import _ from 'lodash'
import ShaclForm from '@/components/ShaclForm/index.vue'
import Breadcrumbs from '@/components/Breadcrumbs/index.vue'
import Page from '@/components/Page/index.vue'
import StatusFlash from '@/components/StatusFlash/index.vue'
import Graph from '@/rdf/Graph'
import permissions from '@/utils/permissions'
import { parseValidationReport, ValidationReport } from '@/components/ShaclForm/Parser/ValidationReport'
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
  data() {
    return {
      simpleGraph: null,
      shacl: null,
      validationReport: {} as ValidationReport,
      submitStatus: new Status(),
      rawError: null,
    }
  },
  methods: {
    async fetchData(): Promise<void> {
      try {
        this.status.setPending()
        const [entity, spec, meta] = await this.loadData()

        if (this.isAdmin || permissions.hasWrite(meta.data)) {
          this.buildGraph(entity.data)
          this.shacl = spec.data
          this.simpleGraph = new Graph(entity.data, this.subject)
          this.breadcrumbs = this.config.createBreadcrumbsWithSelf(meta.data.path, this.subject)
          this.status.setDone()
        } else {
          await this.$router.replace(this.config.toUrl(this.entityId))
        }
      } catch (error) {
        this.status.setErrorFromResponse(error, 'Unable to get entity data.')
      }
    },
    async loadData() {
      return axios.all([
        this.config.api.get(this.entityId),
        this.config.api.getSpec(),
        this.config.api.getMeta(this.entityId),
      ])
    },
    async onSubmit(turtle: string): Promise<void> {
      try {
        this.submitStatus.setPending()
        await this.config.api.put(this.entityId, turtle)
        await this.$router.push(this.config.toUrl(this.entityId))
      } catch (error) {
        this.rawError = _.get(error, 'response.data', null)
        this.validationReport = parseValidationReport(this.rawError)
        this.submitStatus.setError('Unable to update entity data.')
        window.scrollTo(0, 0)
      }
    },
  },
})
</script>
