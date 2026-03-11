<template>
  <entity-edit :config="config" />
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import _ from 'lodash'
import EntityEdit from '@/components/EntityEdit/index.vue'

export default defineComponent({
  components: { EntityEdit },
  data() {
    return {
      config: null,
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
      const url = _.get(this.$route, 'params.entity', '')
      this.config = this.$store.getters['entities/config'](url)
    },
  },
})
</script>
