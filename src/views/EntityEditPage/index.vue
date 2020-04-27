<template>
  <entity-edit :config="config" />
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import EntityEdit from '@/components/EntityEdit/index.vue'
import { getConfigFor } from '@/entity/entityConfigs'


@Component({ components: { EntityEdit } })
export default class EntityEditPage extends Vue {
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
