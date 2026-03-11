<template>
  <input
    :value.prop="modelValue"
    class="input-field"
    :placeholder="placeholder"
    :name="name"
    :type="type"
    :step="step"
    @input="onInput"
  >
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import fieldUtils from '@/components/ShaclForm/fieldUtils'
import rdfUtils from '@/rdf/utils'
import valueUtils from '@/components/ShaclForm/valueUtils'

export default defineComponent({
  props: {
    field: { type: Object as PropType<any>, required: true },
    modelValue: { type: [String, Number, Object] as PropType<any>, required: true },
  },
  emits: ['update:modelValue'],
  computed: {
    name() {
      return rdfUtils.pathTerm(this.field.path)
    },
    step() {
      if (fieldUtils.isDecimal(this.field)) {
        return 'any'
      }

      return null
    },
    type() {
      if (fieldUtils.isInteger(this.field) || fieldUtils.isDecimal(this.field)) {
        return 'number'
      }
      return 'text'
    },
    placeholder() {
      if (fieldUtils.isLiteral(this.field)) {
        return 'Enter a literal'
      }
      return ''
    },
  },
  methods: {
    onInput(e) {
      this.$emit('update:modelValue', this.fromInputValue(e.target.value))
    },
    fromInputValue(value) {
      if (fieldUtils.isInteger(this.field)) {
        return valueUtils.integerFromString(value)
      }

      if (fieldUtils.isDecimal(this.field)) {
        return valueUtils.decimalFromString(value)
      }

      return value
    },
  },
})
</script>
