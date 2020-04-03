<template>
  <component
    :is="field.fieldType === 'textarea' ? 'textarea' : 'input'"
    :value="textValue(value)"
    class="input-field"
    :placeholder="placeholder"
    @input="onInput"
    :name="name"
  />
</template>
<script lang="ts">
import * as $rdf from 'rdflib'
import { Component, Prop, Vue } from 'vue-property-decorator'
import _ from 'lodash'
import fieldUtils from '@/components/ShaclForm/fieldUtils'
import rdfUtils from '@/rdf/utils'

@Component
export default class FormInput extends Vue {
  @Prop({ required: true })
  readonly field: any

  @Prop({ required: true })
  readonly value: any

  get isIRI() {
    return fieldUtils.isIRI(this.field)
  }

  get isLiteral() {
    return fieldUtils.isLiteral(this.field)
  }

  get placeholder() {
    if (this.field.class) {
      return `Enter ${this.field.class}`
    }

    if (this.field.datatype) {
      return `Enter ${this.field.datatype}`
    }

    if (this.isIRI) {
      return 'Enter IRI'
    }

    if (this.isLiteral) {
      return 'Enter a literal'
    }

    return ''
  }

  get name() {
    return rdfUtils.pathTerm(this.field.path)
  }

  textValue(value) {
    if (this.isIRI) {
      return _.get(value, 'value')
    }

    return value
  }

  onInput(e) {
    this.$emit('input', this.sanitizeValue(e.target.value))
  }

  sanitizeValue(value) {
    if (this.isIRI) {
      try {
        return $rdf.namedNode(value)
      } catch {
        return value
      }
    }

    return value
  }
}
</script>
