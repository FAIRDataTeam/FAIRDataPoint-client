<template>
  <select
    class="input-field"
    :value="toInputValue(modelValue)"
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
import { defineComponent, PropType } from 'vue'
import valueUtils from '@/components/ShaclForm/valueUtils'

export default defineComponent({
  props: {
    field: { type: Object as PropType<any>, required: true },
    modelValue: { type: [Boolean, String, Object] as PropType<any>, required: true },
  },
  emits: ['update:modelValue'],
  methods: {
    onInput(e) {
      this.$emit('update:modelValue', this.fromInputValue(e.target.value))
    },
    toInputValue(value) {
      if (valueUtils.isTrue(value)) return 'true'
      if (valueUtils.isFalse(value)) return 'false'
      return null
    },
    fromInputValue(value) {
      if (value) {
        return value === 'true'
      }
      return null
    },
  },
})
</script>
