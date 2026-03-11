<template>
  <a
    :href="uri"
    target="_blank"
    class="link"
  >
    {{ resolvedLabel || label }}
  </a>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import api from '../../api'

export default defineComponent({
  props: {
    uri: { type: String, default: null },
    label: { type: String, default: null },
    labelResolved: { type: Boolean, default: false },
  },
  data() {
    return {
      resolvedLabel: null,
    }
  },
  async created(): Promise<void> {
    if (!this.labelResolved) {
      try {
        const label = await api.label.getLabel(this.uri)
        this.resolvedLabel = label.data.label
      } catch {
        // nothing could be fetched, keep default label
      }
    }
  },
})
</script>
