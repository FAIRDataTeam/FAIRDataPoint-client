<template>
  <datepicker
    :value="value"
    :placeholder="placeholder"
    :name="name"
    format="dd-MM-yyyy"
    :clear-button="true"
    :monday-first="true"
    @input="onInput"
  />
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import Datepicker from 'vuejs-datepicker'
import rdfUtils from '@/rdf/utils'


@Component({ components: { Datepicker } })
export default class DatePickerEditor extends Vue {
  @Prop({ required: true })
  readonly field: any

  @Prop({ required: true })
  readonly value: any

  get name() {
    return rdfUtils.pathTerm(this.field.path)
  }

  get placeholder() {
    return 'Enter date'
  }

  onInput(value) {
    value.setUTCHours(0, 0, 0, 0)
    this.$emit('input', value)
  }
}
</script>
