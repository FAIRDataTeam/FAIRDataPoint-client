<template>
  <entity-view :config="config" />
</template>
<script lang="ts">
import _ from 'lodash'
import { Component, Vue, Watch } from 'vue-property-decorator'
import EntityView from '@/components/EntityView/index.vue'


@Component({ components: { EntityView } })
export default class EntityViewPage extends Vue {
  config = null

  created(): void {
    this.init()
  }

  @Watch('$route')
  init() {
    const url = _.get(this.$route, 'params.entity', '')
    this.config = this.$store.getters['entities/config'](url)
  }
}
</script>
