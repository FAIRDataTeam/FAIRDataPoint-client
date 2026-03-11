<template>
  <input
    :value.prop="toInputValue(modelValue)"
    class="input-field"
    :placeholder="placeholder"
    :name="name"
    @input="onInput"
  >
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import * as $rdf from 'rdflib'
import _ from 'lodash'
import rdfUtils from '@/rdf/utils'

export default defineComponent({
  props: {
    field: { type: Object as PropType<any>, required: true },
    modelValue: { type: [Object, String] as PropType<any>, required: true },
  },
  emits: ['update:modelValue'],
  computed: {
    name() {
      return rdfUtils.pathTerm(this.field.path)
    },
    placeholder() {
      return 'Enter IRI'
    },
  },
  methods: {
    onInput(e) {
      this.$emit('update:modelValue', this.fromInputValue(e.target.value))
    },
    toInputValue(value) {
      return _.get(value, 'value', value)
    },
    fromInputValue(value) {
      try {
        return $rdf.namedNode(value)
      } catch {
        return value
      }
    },
  },
})
</script>
