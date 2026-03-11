<template>
  <div>
    <div v-if="metadataSchemaGroups">
      <status-flash
        :status="importStatus"
        no-loading
      />
      <template v-if="importStatus.isSuccess()">
        <router-link
          class="btn btn-primary btn-rounded"
          to="/schemas"
        >
          Done
        </router-link>
      </template>
      <template v-else-if="metadataSchemaGroups.length === 0">
        <slot />
      </template>
      <template v-else>
        <label>Select metadata schemas for import</label>

        <div class="item-list">
          <div
            v-for="(metadataSchemaGroup, groupIndex) in metadataSchemaGroups"
            :key="groupIndex"
            class="item-group"
          >
            <hr v-if="groupIndex > 0">
            <div
              v-for="(metadataSchema, index) in metadataSchemaGroup"
              :key="metadataSchema.schema.versionUuid"
              class="item"
              :class="{ 'item-indented': index > 0 }"
            >
              <div class="item__title">
                <label>
                  <input
                    v-model="metadataSchema.selected"
                    type="checkbox"
                    :disabled="!metadataSchema.canImport"
                  >
                  {{ metadataSchema.schema.name }}

                  <b-badge
                    pill
                    variant="light"
                  >{{ metadataSchema.schema.version }}
                  </b-badge>
                  <b-badge
                    v-if="metadataSchema.status === 'DIRTY'"
                    pill
                    variant="warning"
                  >Diry
                  </b-badge>
                  <b-badge
                    v-if="metadataSchema.status === 'CONFLICT'"
                    pill
                    variant="danger"
                  >Conflict
                  </b-badge>
                  <b-badge
                    v-if="metadataSchema.status === 'ALREADY_IMPORTED'"
                    pill
                    variant="success"
                  >Already Imported
                  </b-badge>
                </label>

                <a
                  v-if="!isDefinitionVisible(metadataSchema.schema.versionUuid)"
                  @click.prevent="showShape(metadataSchema.schema.versionUuid)"
                >Show</a>
                <a
                  v-else
                  @click.prevent="hideShape(metadataSchema.schema.versionUuid)"
                >Hide</a>
              </div>
              <div />
              <div v-if="isDefinitionVisible(metadataSchema.schema.versionUuid)">
                <prism-editor
                  v-model="metadataSchema.schema.definition"
                  language="turtle"
                  :readonly="true"
                />
              </div>
            </div>
          </div>
        </div>
        <div>
          <button
            class="btn btn-primary btn-rounded"
            :disabled="importStatus.isPending() || !someShapeSelected"
            data-cy="import-shapes"
            @click.prevent="importShapes"
          >
            Import shapes
          </button>
        </div>
      </template>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import _ from 'lodash'
import PrismEditor from '@/components/PrismEditor/index.vue'
import semverRcompare from 'semver/functions/rcompare'
import Status from '@/utils/Status'
import api from '@/api'
import StatusFlash from '@/components/StatusFlash/index.vue'

export default defineComponent({
  components: {
    PrismEditor, StatusFlash,
  },
  props: {
    metadataSchemas: { type: Array, default: () => [] },
  },
  data() {
    return {
      importStatus: new Status() as Status,
      metadataSchemaGroups: [] as any[],
      showDefinition: [] as string[],
    }
  },
  computed: {
    selectedSchemas() {
      if (this.metadataSchemaGroups) {
        const checkStatus = (schema) => _.get(schema, 'status') !== 'ALREADY_IMPORTED'
        const checkSelected = (schema) => _.get(schema, 'selected')
        return _.flatten(this.metadataSchemaGroups)
          .filter((schema) => checkStatus(schema) && checkSelected(schema))
          .map((schema) => _.get(schema, 'schema'))
      }
      return []
    },
    someShapeSelected() {
      return this.selectedSchemas.length > 0
    },
  },
  mounted() {
    this.createMetadataGroups()
  },
  methods: {
    isDefinitionVisible(uuid) {
      return this.showDefinition.some((u) => u === uuid)
    },
    showShape(uuid) {
      this.showDefinition.push(uuid)
    },
    hideShape(uuid) {
      this.showDefinition = this.showDefinition.filter((u) => u !== uuid)
    },
    createMetadataGroups() {
      const preselected = this.metadataSchemas.map((schema) => {
        if (schema.status === 'ALREADY_IMPORTED') {
          return { ...schema, selected: true }
        }
        return schema
      })
      const groups = Object.values(_.groupBy(preselected, (ms) => ms.schema.uuid))
      const comparator = (a, b) => semverRcompare(a.schema.version, b.schema.version)
      const mapName = (a) => _.get(a, '0.schema.name')
      this.metadataSchemaGroups = _.sortBy(groups.map((group) => group.sort(comparator)), mapName)
    },
    async importShapes() {
      if (this.someShapeSelected) {
        try {
          this.importStatus.setPending()
          await api.metadataSchemas.postImport(this.selectedSchemas)
          this.importStatus.setDone('Metadata schemas were successfully imported')
        } catch (err) {
          this.importStatus.setErrorFromResponse(err, 'Unable to import metadata schemas')
        }
      }
    },
  },
})
</script>
