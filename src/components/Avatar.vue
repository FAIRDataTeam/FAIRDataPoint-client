<template>
  <div
    class="avatar"
    :style="`background-color: ${toColor(value)}`"
  >
    {{ initials }}
  </div>
</template>
<script>
import _ from 'lodash'

export default {
  name: 'Avatar',
  props: {
    initials: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      default: null,
    },
  },
  methods: {
    toColor(value) {
      if (value === null) return '#ddd'
      const hash = _.sum(value.split('').map(a => a.charCodeAt(0)))
      const h = hash % 360
      const s = 25 + (hash % 71)
      const l = 85 + (hash % 11)
      return `hsl(${h}, ${s}%, ${l}%)`
    },
  },
}
</script>
<style scoped lang="scss">
.avatar {
  width: 3rem;
  height: 3rem;
  border-radius: 3rem;
  background: #ddd;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.125rem;
}
</style>
