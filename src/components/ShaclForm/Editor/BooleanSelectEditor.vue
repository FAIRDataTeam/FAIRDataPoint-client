<template>
  <select
    class="input-field"
    :value="toInputValue(value)"
    @input="onInput"
  >
    <option :value="null" />
    <option value="false">
      false
    </option>
    <option value="true">
      true
    </option>
  </select>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import valueUtils from '@/components/ShaclForm/valueUtils'

@Component({})
export default class BooleanSelectEditor extends Vue {
  @Prop({ required: true })
  readonly field: any

  @Prop({ required: true })
  readonly value: any

  onInput(e) {
    this.$emit('input', this.fromInputValue(e.target.value))
  }

  toInputValue(value) {
    if (valueUtils.isTrue(value)) return 'true'
    if (valueUtils.isFalse(value)) return 'false'
    return null
  }

  fromInputValue(value) {
    if (value) {
      return value === 'true'
    }
    return null
  }
}
</script>
