<template>
  <div class="line-numbers">
    <div
      v-for="number in numbers"
      :key="number"
    >
      {{ number }}
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import _ from 'lodash'

export default defineComponent({
  props: {
    from: { type: Number, required: true },
    to: { type: Number, required: true },
  },
  computed: {
    numbers() {
      return _.range(this.from, this.to)
    },
  },
})
</script>
