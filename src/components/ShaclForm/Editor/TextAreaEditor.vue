<template>
  <textarea
    :value.prop="modelValue"
    class="input-field"
    :placeholder="placeholder"
    :name="name"
    @input="onInput"
  />
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import fieldUtils from '@/components/ShaclForm/fieldUtils'
import rdfUtils from '@/rdf/utils'

export default defineComponent({
  props: {
    field: { type: Object as PropType<any>, required: true },
    modelValue: { type: [String, Object] as PropType<any>, required: true },
  },
  emits: ['update:modelValue'],
  computed: {
    name() {
      return rdfUtils.pathTerm(this.field.path)
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
      this.$emit('update:modelValue', e.target.value)
    },
  },
})
</script>
