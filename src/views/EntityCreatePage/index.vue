<template>
  <entity-create
    :config="config"
    :parent-config="parentConfig"
  />
</template>
<script lang="ts">
import _ from 'lodash'
import { Component, Vue, Watch } from 'vue-property-decorator'
import EntityCreate from '@/components/EntityCreate/index.vue'


@Component({ components: { EntityCreate } })
export default class EntityCreatePage extends Vue {
  config = null

  parentConfig = null

  created(): void {
    this.init()
  }

  @Watch('$route')
  init() {
    const entity = _.get(this.$route.params, 'entity', '')
    const parentEntity = _.get(this.$route.params, 'parentEntity', '')
    this.config = this.$store.getters['entities/config'](entity)
    this.parentConfig = this.$store.getters['entities/config'](parentEntity)

    const containsChild = this.parentConfig.children.some(
      child => child.resourceDefinitionUuid === this.config.uuid,
    )

    if (!containsChild) {
      this.config = null
      this.parentConfig = null
    }
  }
}
</script>
