<template>
  <div class="input-wrapper">
    <auto-complete-editor
      v-if="isAutoCompleteEditor"
      :field="field"
      :value="value"
      @input="onInput"
    />
    <date-picker-editor
      v-else-if="isDatePickerEditor"
      :field="field"
      :value="value"
      format="YYYY-MM-DD"
      @input="onInput"
    />
    <date-picker-editor
      v-else-if="isDateTimePickerEditor"
      :field="field"
      :value="value"
      format="YYYY-MM-DD HH:mm"
      type="datetime"
      @input="onInput"
    />
    <enum-select-editor
      v-else-if="isEnumSelectEditor"
      :field="field"
      :value="value"
      @input="onInput"
    />
    <uri-editor
      v-else-if="isURIEditor"
      :field="field"
      :value="value"
      @input="onInput"
    />
    <text-area-editor
      v-else-if="isTextAreaEditor"
      :field="field"
      :value="value"
      @input="onInput"
    />
    <text-field-editor
      v-else
      :field="field"
      :value="value"
      @input="onInput"
    />
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { DASH, SHACL } from '@/rdf/namespaces'
import TextFieldEditor from '@/components/ShaclForm/Editor/TextFieldEditor.vue'
import TextAreaEditor from '@/components/ShaclForm/Editor/TextAreaEditor.vue'
import URIEditor from '@/components/ShaclForm/Editor/URIEditor.vue'
import DatePickerEditor from '@/components/ShaclForm/Editor/DatePickerEditor.vue'
import fieldUtils from '@/components/ShaclForm/fieldUtils'
import EnumSelectEditor from '@/components/ShaclForm/Editor/EnumSelectEditor.vue'
import AutoCompleteEditor from '@/components/ShaclForm/Editor/AutoCompleteEditor.vue'

@Component({
  components: {
    AutoCompleteEditor,
    EnumSelectEditor,
    DatePickerEditor,
    TextAreaEditor,
    TextFieldEditor,
    UriEditor: URIEditor,
  },
})
export default class FormInput extends Vue {
  @Prop({ required: true })
  readonly field: any

  @Prop({ required: true })
  readonly value: any

  get isAutoCompleteEditor() {
    return this.field.editor === DASH('AutoCompleteEditor').value
  }

  get isDatePickerEditor() {
    return this.field.editor === DASH('DatePickerEditor').value
  }

  get isDateTimePickerEditor() {
    return this.field.editor === DASH('DateTimePickerEditor').value
  }

  get isEnumSelectEditor() {
    return this.field.editor === DASH('EnumSelectEditor').value
  }

  get isTextAreaEditor() {
    return this.field.editor === DASH('TextAreaEditor').value
  }

  get isURIEditor() {
    return this.field.editor === DASH('URIEditor').value || fieldUtils.isIRI(this.field)
  }

  onInput(value) {
    this.$emit('input', value)
  }
}
</script>
