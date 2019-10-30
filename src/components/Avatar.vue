<template>
  <div
    class="avatar"
    :style="`background-color: ${toColor(value)}`"
    :class="{
      'avatar--smaller': smaller,
    }"
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
    smaller: {
      type: Boolean,
      default: false,
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
@import "../scss/typography";

.avatar {
  @include typography-default-18-semibold;
  text-decoration: none;
  width: 3rem;
  height: 3rem;
  border-radius: 3rem;
  background: #ddd;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    text-decoration: none;
  }

  &--smaller {
    @include typography-default-16-semibold;
    width: 2.5rem;
    height: 2.5rem;
  }
}
</style>
