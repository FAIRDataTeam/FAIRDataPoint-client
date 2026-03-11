<template>
  <entity-create
    :config="config"
    :parent-config="parentConfig"
  />
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import _ from 'lodash'
import EntityCreate from '@/components/EntityCreate/index.vue'

export default defineComponent({
  components: { EntityCreate },
  data() {
    return {
      config: null,
      parentConfig: null,
    }
  },
  watch: {
    $route: 'init',
  },
  created(): void {
    this.init()
  },
  methods: {
    init() {
      const entity = _.get(this.$route.params, 'entity', '')
      const parentEntity = _.get(this.$route.params, 'parentEntity', '')
      this.config = this.$store.getters['entities/config'](entity)
      this.parentConfig = this.$store.getters['entities/config'](parentEntity)

      const containsChild = this.parentConfig.children.some(
        (child) => child.resourceDefinitionUuid === this.config.uuid,
      )

      if (!containsChild) {
        this.config = null
        this.parentConfig = null
      }
    },
  },
})
</script>
