<template>
  <select
    class="input-field"
    :value="toInputValue(modelValue)"
    @input="onInput"
  >
    <option :value="null">
      - select -
    </option>
    <option
      v-for="option in createOptions()"
      :key="option.key"
      :value="option.key"
    >
      {{ option.value }}
    </option>
  </select>
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
  methods: {
    createOptions() {
      return _.get(this.field, 'in', []).map((val) => ({
        key: val,
        value: rdfUtils.pathTerm(val),
      }))
    },
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
