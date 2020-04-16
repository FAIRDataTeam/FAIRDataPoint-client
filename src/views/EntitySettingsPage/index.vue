<template>
  <entity-settings :config="config" />
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import EntitySettings from '@/components/EntitySettings/index.vue'
import { getConfigFor } from '@/entity/entityConfigs'


@Component({ components: { EntitySettings } })
export default class EntitySettingsPage extends Vue {
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
