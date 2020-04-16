<template>
  <entity-create
    :config="config"
    :parent-config="parentConfig"
  />
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import EntityCreate from '@/components/EntityCreate/index.vue'
import { getConfigFor, getParentConfigFor } from '@/entity/entityConfigs'


@Component({ components: { EntityCreate } })
export default class EntityCreatePage extends Vue {
  config = null

  parentConfig = null

  created(): void {
    this.init()
  }

  @Watch('$route')
  init() {
    const { entity, parentEntity } = this.$route.params
    this.config = getConfigFor(entity)
    this.parentConfig = getParentConfigFor(entity)

    if (!this.validConfiguration(parentEntity, this.parentConfig.name)) {
      this.config = null
      this.parentConfig = null
    }
  }

  validConfiguration(parentEntity, parentConfigName) {
    if (parentEntity) {
      return parentConfigName === parentEntity
    }
    return parentConfigName === 'repository'
  }
}
</script>
