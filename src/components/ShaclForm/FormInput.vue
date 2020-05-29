<template>
  <div class="input-wrapper">
    <date-picker-editor
      v-if="isDatePickerEditor"
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

@Component({
  components: {
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

  get isDatePickerEditor() {
    return this.field.editor === DASH('DatePickerEditor').value
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
