<template>
  <div class="shapes-import">
    <page
      title="Import Shapes"
      content-only
      small
    >
      <template v-slot:content>
        <form
          v-if="!shapes"
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
        <div
          v-else
        >
          <status-flash
            :status="importStatus"
            no-loading
          />
          <template v-if="importStatus.isSuccess()">
            <router-link
              class="btn btn-primary btn-rounded"
              to="/shapes"
            >
              Done
            </router-link>
          </template>
          <template v-else>
            <label>Select shapes for import</label>

            <div class="item-list">
              <div
                v-for="shape in shapes"
                :key="shape.uuid"
                class="item"
              >
                <div class="item__title">
                  <label>
                    <input
                      v-model="shape.selected"
                      type="checkbox"
                    >
                    {{ shape.name }}
                  </label>
                  <a
                    v-if="!isDefinitionVisible(shape.uuid)"
                    @click.prevent="showShape(shape.uuid)"
                  >Show</a>
                  <a
                    v-else
                    @click.prevent="hideShape(shape.uuid)"
                  >Hide</a>
                </div>
                <div v-if="isDefinitionVisible(shape.uuid)">
                  <prism-editor
                    v-model="shape.definition"
                    language="turtle"
                    :readonly="true"
                  />
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
      </template>
    </page>
  </div>
</template>
<script lang="ts">
import _ from 'lodash'
import { Component, Vue, Watch } from 'vue-property-decorator'
import PrismEditor from 'vue-prism-editor'
import api from '../../api'
import ItemSimple from '../../components/ItemSimple/index.vue'
import Page from '@/components/Page/index.vue'
import Status from '@/utils/Status'
import StatusFlash from '../../components/StatusFlash/index.vue'


@Component({ components: { Page, PrismEditor, StatusFlash } })
export default class ShapesImport extends Vue {
  loadingStatus: Status = new Status()

  importStatus: Status = new Status()

  fdpUrl: string = null

  shapes: any = null

  showDefinition = []

  get fdpUrlEmpty() {
    return _.isEmpty(this.fdpUrl)
  }

  get someShapeSelected() {
    return this.shapes && this.shapes.some(shape => shape.selected)
  }

  isDefinitionVisible(uuid) {
    return this.showDefinition.some(u => u === uuid)
  }

  showShape(uuid) {
    this.showDefinition.push(uuid)
  }

  hideShape(uuid) {
    this.showDefinition = this.showDefinition.filter(u => u !== uuid)
  }

  async loadShapes() {
    if (!this.fdpUrlEmpty) {
      try {
        this.loadingStatus.setPending()
        const response = await api.shapes.getImport(this.fdpUrl)
        this.shapes = response.data
        this.loadingStatus.setDone()
      } catch (err) {
        this.loadingStatus.setError(`Unable to retrieve shapes from ${this.fdpUrl}`)
      }
    }
  }

  async importShapes() {
    if (this.someShapeSelected) {
      try {
        this.importStatus.setPending()
        const shapes = this.shapes.filter(shape => shape.selected)
        await api.shapes.postImport(shapes)
        this.importStatus.setDone('Shapes were successfully imported')
      } catch (err) {
        this.importStatus.setError('Unable to import shapes')
      }
    }
  }
}
</script>
