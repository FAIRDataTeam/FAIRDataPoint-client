<template>
  <div>
    <status-flash :status="status" />
    <page
      v-if="shape"
      :title="shape.name"
      :content-only="true"
    >
      <template #content>
        <prism-editor
          v-model="shape.definition"
          language="turtle"
          :readonly="true"
        />
      </template>
    </page>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import PrismEditor from 'vue-prism-editor'
import api from '@/api'
import EntityMetadata from '@/components/EntityMetadata/index.vue'
import Page from '@/components/Page/index.vue'
import Status from '@/utils/Status'
import StatusFlash from '@/components/StatusFlash/index.vue'

@Component({
  components: {
    EntityMetadata, Page, PrismEditor, StatusFlash,
  },
})
export default class ShapeView extends Vue {
  shape: any = null

  title: string = null

  status: Status = new Status()

  metadata: any = null

  get shapeId(): string {
    return this.$route.params.id
  }

  created(): void {
    this.init()
  }

  @Watch('$route')
  async init(): Promise<void> {
    try {
      this.status.setPending()

      const shape = await api.shapes.getShape(this.shapeId)
      this.shape = shape.data

      this.status.setDone()
    } catch (error) {
      this.status.setError('Unable to get profile.')
    }
  }
}
</script>
