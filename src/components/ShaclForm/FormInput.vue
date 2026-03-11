<template>
  <div class="input-wrapper">
    <auto-complete-editor
      v-if="isAutoCompleteEditor"
      :field="field"
      :model-value="modelValue"
      @update:modelValue="onInput"
    />
    <date-picker-editor
      v-else-if="isDatePickerEditor"
      :field="field"
      :model-value="modelValue"
      format="YYYY-MM-DD"
      @update:modelValue="onInput"
    />
    <date-picker-editor
      v-else-if="isDateTimePickerEditor"
      :field="field"
      :model-value="modelValue"
      format="YYYY-MM-DD HH:mm"
      type="datetime"
      @update:modelValue="onInput"
    />
    <enum-select-editor
      v-else-if="isEnumSelectEditor"
      :field="field"
      :model-value="modelValue"
      @update:modelValue="onInput"
    />
    <uri-editor
      v-else-if="isURIEditor"
      :field="field"
      :model-value="modelValue"
      @update:modelValue="onInput"
    />
    <text-area-editor
      v-else-if="isTextAreaEditor"
      :field="field"
      :model-value="modelValue"
      @update:modelValue="onInput"
    />
    <boolean-select-editor
      v-else-if="isBooleanEditor"
      :field="field"
      :model-value="modelValue"
      @update:modelValue="onInput"
    />
    <text-field-editor
      v-else
      :field="field"
      :model-value="modelValue"
      @update:modelValue="onInput"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { DASH } from '@/rdf/namespaces'
import AutoCompleteEditor from '@/components/ShaclForm/Editor/AutoCompleteEditor.vue'
import BooleanSelectEditor from '@/components/ShaclForm/Editor/BooleanSelectEditor.vue'
import DatePickerEditor from '@/components/ShaclForm/Editor/DatePickerEditor.vue'
import EnumSelectEditor from '@/components/ShaclForm/Editor/EnumSelectEditor.vue'
import TextAreaEditor from '@/components/ShaclForm/Editor/TextAreaEditor.vue'
import TextFieldEditor from '@/components/ShaclForm/Editor/TextFieldEditor.vue'
import URIEditor from '@/components/ShaclForm/Editor/URIEditor.vue'
import fieldUtils from '@/components/ShaclForm/fieldUtils'

export default defineComponent({
  components: {
    BooleanSelectEditor,
    AutoCompleteEditor,
    EnumSelectEditor,
    DatePickerEditor,
    TextAreaEditor,
    TextFieldEditor,
    UriEditor: URIEditor,
  },
  props: {
    field: { type: Object, required: true },
    modelValue: { type: [String, Number, Object], required: true },
  },
  emits: ['update:modelValue'],
  computed: {
    isAutoCompleteEditor() {
      return this.field.editor === DASH('AutoCompleteEditor').value
    },
    isDatePickerEditor() {
      return this.field.editor === DASH('DatePickerEditor').value
    },
    isDateTimePickerEditor() {
      return this.field.editor === DASH('DateTimePickerEditor').value
    },
    isEnumSelectEditor() {
      return this.field.editor === DASH('EnumSelectEditor').value
    },
    isTextAreaEditor() {
      return this.field.editor === DASH('TextAreaEditor').value
    },
    isURIEditor() {
      return this.field.editor === DASH('URIEditor').value || fieldUtils.isIRI(this.field)
    },
    isBooleanEditor() {
      return this.field.editor === DASH('BooleanSelectEditor').value
    },
  },
  methods: {
    onInput(value) {
      const normalized = value && value.target ? value.target.value : value
      this.$emit('update:modelValue', normalized)
    },
  },
})
</script>
