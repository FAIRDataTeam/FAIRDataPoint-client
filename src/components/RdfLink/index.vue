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
import {
  Component, Prop, Vue, Watch,
} from 'vue-property-decorator'
import api from '../../api'

@Component
export default class RdfLink extends Vue {
  @Prop({ type: String })
  readonly uri: string

  @Prop({ type: String })
  readonly label: string

  resolvedLabel : string = null

  async created(): Promise<void> {
    try {
      const label = await api.label.getLabel(this.uri)
      this.resolvedLabel = label.data.label
    } catch {
      // nothing could be fetched, keep default label
    }
  }
}
</script>
