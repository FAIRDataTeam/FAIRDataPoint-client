<template>
  <entity-settings :config="config" />
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import EntitySettings from '@/components/EntitySettings/index.vue'


@Component({ components: { EntitySettings } })
export default class EntitySettingsPage extends Vue {
  config = null

  created(): void {
    this.init()
  }

  @Watch('$route')
  init() {
    this.config = this.$store.getters['entities/config'](this.$route.params.entity)
  }
}
</script>
