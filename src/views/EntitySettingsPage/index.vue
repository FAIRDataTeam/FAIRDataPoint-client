<template>
  <entity-settings :config="config" />
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import EntitySettings from '@/components/EntitySettings/index.vue'

export default defineComponent({
  components: { EntitySettings },
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
      this.config = this.$store.getters['entities/config'](this.$route.params.entity)
    },
  },
})
</script>
