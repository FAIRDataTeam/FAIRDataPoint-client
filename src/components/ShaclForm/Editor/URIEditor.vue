<template>
  <input
    :value.prop="toInputValue(value)"
    class="input-field"
    :placeholder="placeholder"
    :name="name"
    @input="onInput"
  >
</template>
<script lang="ts">
import * as $rdf from 'rdflib'
import _ from 'lodash'
import { Component, Prop, Vue } from 'vue-property-decorator'
import rdfUtils from '@/rdf/utils'


@Component
export default class URIEditor extends Vue {
  @Prop({ required: true })
  readonly field: any

  @Prop({ required: true })
  readonly value: any

  get name() {
    return rdfUtils.pathTerm(this.field.path)
  }

  get placeholder() {
    return 'Enter IRI'
  }

  onInput(e) {
    this.$emit('input', this.fromInputValue(e.target.value))
  }

  toInputValue(value) {
    return _.get(value, 'value', value)
  }

  fromInputValue(value) {
    try {
      return $rdf.namedNode(value)
    } catch {
      return value
    }
  }
}
</script>
