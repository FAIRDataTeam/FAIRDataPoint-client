<template>
  <div
    class="avatar"
    :style="`background: ${color}`"
    :class="{
      'avatar--smaller': smaller,
    }"
  >
    {{ initials }}
  </div>
</template>
<script lang="ts">
import _ from 'lodash'
import { Component, Prop, Vue } from 'vue-property-decorator'


@Component
export default class Avatar extends Vue {
  @Prop({ type: String, required: true })
  readonly initials: string

  @Prop({ type: String, default: null })
  readonly value: string

  @Prop({ type: Boolean, default: false })
  readonly smaller: boolean


  get color(): string {
    if (this.value === null) return '#ddd'
    const hash = _.sum(this.value.split('').map(a => 43 * a.charCodeAt(0)))
    const h1 = hash % 360
    const s1 = 125 + (hash % 71)
    const l1 = 85 + (hash % 11)
    const hash2 = hash + 60
    const h2 = hash2 % 360
    const s2 = 125 + (hash2 % 71)
    const l2 = 85 + (hash2 % 11)
    return `linear-gradient(45deg, hsl(${h1}, ${s1}%, ${l1}%), hsl(${h2}, ${s2}%, ${l2}%))`
  }
}
</script>
