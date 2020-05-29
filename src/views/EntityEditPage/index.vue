<template>
  <entity-edit :config="config" />
</template>
<script lang="ts">
import _ from 'lodash'
import { Component, Vue, Watch } from 'vue-property-decorator'
import EntityEdit from '@/components/EntityEdit/index.vue'


@Component({ components: { EntityEdit } })
export default class EntityEditPage extends Vue {
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
