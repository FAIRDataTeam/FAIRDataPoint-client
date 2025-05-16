<template>
  <date-picker
    :value="convert(value)"
    :placeholder="placeholder"
    :type="type"
    :format="format"
    value-type="format"
    :name="name"
    @input="onInput"
  />
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import DatePicker from 'vue2-datepicker'
import rdfUtils from '@/rdf/utils'
import moment from 'moment'

@Component({ components: { DatePicker } })
export default class DatePickerEditor extends Vue {
  @Prop({ required: true })
  readonly field: any

  @Prop({ required: true })
  readonly value: any

  @Prop({ required: true })
  readonly format: any

  @Prop({ required: false, default: 'date' })
  readonly type: any

  get name() {
    return rdfUtils.pathTerm(this.field.path)
  }

  get placeholder() {
    return 'Enter date'
  }

  convert(val) {
    return val ? moment(val).format(this.format) : null
  }

  onInput(val) {
    // only convert to JS Date when we actually need the time component
    this.$emit('input', this.type === 'date' ? val : moment(val).toDate())
  }
}
</script>
