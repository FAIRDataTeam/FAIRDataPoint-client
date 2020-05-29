<template>
  <input
    :value.prop="value"
    class="input-field"
    :placeholder="placeholder"
    :name="name"
    @input="onInput"
  >
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import fieldUtils from '@/components/ShaclForm/fieldUtils'
import rdfUtils from '@/rdf/utils'


@Component
export default class TextFieldEditor extends Vue {
  @Prop({ required: true })
  readonly field: any

  @Prop({ required: true })
  readonly value: any

  get name() {
    return rdfUtils.pathTerm(this.field.path)
  }

  get placeholder() {
    if (fieldUtils.isLiteral(this.field)) {
      return 'Enter a literal'
    }
    return ''
  }

  onInput(e) {
    this.$emit('input', e.target.value)
  }
}
</script>
