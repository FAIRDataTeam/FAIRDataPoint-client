<template>
  <input
    :value.prop="value"
    class="input-field"
    :placeholder="placeholder"
    :name="name"
    :type="type"
    :step="step"
    @input="onInput"
  >
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import fieldUtils from '@/components/ShaclForm/fieldUtils'
import rdfUtils from '@/rdf/utils'
import valueUtils from '@/components/ShaclForm/valueUtils'

@Component
export default class TextFieldEditor extends Vue {
  @Prop({ required: true })
  readonly field: any

  @Prop({ required: true })
  readonly value: any

  get name() {
    return rdfUtils.pathTerm(this.field.path)
  }

  get step() {
    if (fieldUtils.isDecimal(this.field)) {
      return 'any'
    }

    return null
  }

  get type() {
    if (fieldUtils.isInteger(this.field) || fieldUtils.isDecimal(this.field)) {
      return 'number'
    }
    return 'text'
  }

  get placeholder() {
    if (fieldUtils.isLiteral(this.field)) {
      return 'Enter a literal'
    }
    return ''
  }

  onInput(e) {
    this.$emit('input', this.fromInputValue(e.target.value))
  }

  fromInputValue(value) {
    if (fieldUtils.isInteger(this.field)) {
      return valueUtils.integerFromString(value)
    }

    if (fieldUtils.isDecimal(this.field)) {
      return valueUtils.decimalFromString(value)
    }

    return value
  }
}
</script>
