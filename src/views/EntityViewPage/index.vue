<template>
  <entity-view :config="config" />
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import EntityView from '@/components/EntityView/index.vue'
import { getConfigFor } from '@/entity/entityConfigs'


@Component({ components: { EntityView } })
export default class EntityViewPage extends Vue {
  config = null

  created(): void {
    this.init()
  }

  @Watch('$route')
  init() {
    this.config = getConfigFor(this.$route.params.entity)
  }
}
</script>
