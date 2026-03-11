<template>
  <input
    :value="inputValue"
    :placeholder="placeholder"
    :type="inputType"
    :name="name"
    @input="onInput"
  >
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import moment from 'moment'
import rdfUtils from '@/rdf/utils'

export default defineComponent({
  props: {
    field: { type: Object as PropType<any>, required: true },
    modelValue: { type: [String, Date, Object] as PropType<any>, required: true },
    format: { type: String as PropType<any>, required: true },
    type: { type: String as PropType<any>, required: false, default: 'date' },
  },
  emits: ['update:modelValue'],
  computed: {
    name() {
      return rdfUtils.pathTerm(this.field.path)
    },
    placeholder() {
      return 'Enter date'
    },
    inputType() {
      return this.type === 'date' ? 'date' : 'datetime-local'
    },
    inputValue() {
      if (!this.modelValue) return ''
      const value = moment(this.modelValue)
      return value.format(this.inputType === 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DDTHH:mm')
    },
  },
  methods: {
    onInput(event) {
      const val = event.target.value
      if (!val) {
        this.$emit('update:modelValue', null)
        return
      }
      // only convert to JS Date when we actually need the time component
      this.$emit('update:modelValue', this.type === 'date' ? val : moment(val).toDate())
    },
  },
})
</script>
