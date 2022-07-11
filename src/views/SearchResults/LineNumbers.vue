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
import _ from 'lodash'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class LineNumbers extends Vue {
  @Prop({ required: true })
    from: number

  @Prop({ required: true })
    to: number

  get numbers() {
    return _.range(this.from, this.to)
  }
}
</script>
