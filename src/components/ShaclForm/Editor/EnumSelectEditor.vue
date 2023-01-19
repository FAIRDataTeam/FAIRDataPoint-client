<template>
  <select
    class="input-field"
    :value="toInputValue(value)"
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
import * as $rdf from 'rdflib'
import _ from 'lodash'
import { Component, Prop, Vue } from 'vue-property-decorator'
import rdfUtils from '@/rdf/utils'

@Component({})
export default class EnumSelectEditor extends Vue {
  @Prop({ required: true })
  readonly field: any

  @Prop({ required: true })
  readonly value: any

  createOptions() {
    return _.get(this.field, 'in', []).map((val) => ({
      key: val,
      value: rdfUtils.pathTerm(val),
    }))
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
