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
import { CustomDate, XsdDateTypes } from '@/components/ShaclForm/CustomDate'

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

  /* the DataPickerEditor can handle Date & DateTime, but internally it
  uses Data object that always had date/time. So when you selected a data we should hide
  time part of the date, if you want a datePicker
  */
  dateFormat(val) {
    return this.type === 'date'
      ? moment(val).toISOString(true).split('T')[0]
      : moment(val).toISOString(true)
  }

  convert(val) {
    return val ? moment(val).format(this.format) : null
  }

  onInput(val) {
    // this.$emit('input', new CustomDate(moment(val).toDate(), this.type === 'date' ? XsdDateTypes.Date : XsdDateTypes.DateTime))
    this.$emit('input', this.dateFormat(val))
  }
}
</script>
