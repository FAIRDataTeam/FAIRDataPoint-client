<template>
  <div
    :key="componentKey"
    class="form form-renderer"
  >
    <div
      v-for="field in definition.fields"
      :key="`${field.path}`"
      :class="{'form__group': true, 'form__group--error': getError(field)}"
    >
      <label :class="{required: isRequired(field)}">{{ getName(field) }}</label>
      <component :is="isList(field) ? 'ul' : 'div'">
        <component
          :is="isList(field) ? 'li' : 'div'"
          v-for="(_, i) in data[field.path]"
          :key="`${field.path}.${i}`"
        >
          <div class="d-flex">
            <form-renderer
              v-if="field.nodeShape"
              v-model="data[field.path][i]"
              :definition="field.nodeShape"
              :validation-report="validationReport"
              @input="onInput"
            />
            <form-input
              v-else
              v-model="data[field.path][i]"
              :field="field"
              @input="onInput"
            />
            <a
              v-if="canBeRemoved(field)"
              class="text-danger ml-3 p-1"
              @click="removeValue(field, i)"
            >
              <fa :icon="['fas', 'times']" />
            </a>
          </div>
        </component>
      </component>
      <button
        v-if="isList(field)"
        class="btn btn-link"
        @click.prevent="addValue(field)"
      >
        <fa :icon="['fas', 'plus']" />
        Add
      </button>
      <p
        v-if="getError(field)"
        class="invalid-feedback"
      >
        {{ getError(field) }}
      </p>
    </div>
  </div>
</template>
<script lang="ts">
import * as $rdf from 'rdflib'
import { Component, Prop, Vue } from 'vue-property-decorator'
import _ from 'lodash'
import FormInput from '@/components/ShaclForm/FormInput.vue'
import fieldUtils from '@/components/ShaclForm/fieldUtils'
import { ValidationReport } from '@/components/ShaclForm/Parser/ValidationReport'
import { SHACL } from '@/rdf/namespaces'

@Component({
  name: 'FormRenderer',
  components: { FormInput },
})
export default class FormRenderer extends Vue {
  @Prop({ required: true })
  readonly definition: any

  @Prop({ required: false, default: () => $rdf.blankNode(null) })
  readonly subject: any

  @Prop({ required: true })
  readonly validationReport : ValidationReport

  @Prop({ required: true })
  value: any

  data: any

  componentKey: number = 0

  createDefaultValue(field) {
    if (field.nodeShape) {
      return {
        subject: $rdf.blankNode(null),
        data: {},
      }
    }

    return ''
  }

  createDefaultValueArray(field) {
    if (field.minCount === 1 || field.maxCount === 1) {
      return [this.createDefaultValue(field)]
    }

    return []
  }

  created(): void {
    this.data = this.definition.fields.reduce((acc, field) => {
      acc[field.path] = _.get(this.value.data, field.path, this.createDefaultValueArray(field))
      return acc
    }, {})
    this.onInput()
  }

  getName(field) {
    return fieldUtils.getName(field)
  }

  isRequired(field) {
    return fieldUtils.isRequired(field)
  }

  isList(field) {
    return fieldUtils.isList(field)
  }

  canBeRemoved(field) {
    const values = this.data[field.path].length
    const minCount = _.get(field, 'minCount', 0)
    return this.isList(field) && values > minCount
  }

  addValue(field) {
    this.data[field.path].push(this.createDefaultValue(field))
    this.onInput()
  }

  removeValue(field, index) {
    this.data[field.path].splice(index, 1)
    this.componentKey += 1
    this.onInput()
  }

  getError(field) {
    const subject = `${this.subject}`
    if (_.has(this.validationReport, subject)) {
      return this.humanReadableError(field, this.validationReport[subject][field.path])
    }
    return null
  }

  humanReadableError(field, originalError) {
    switch (originalError) {
      case SHACL('MinCountConstraintComponent').value:
        return `${this.getName(field)} is required.`

      case SHACL('NodeKindConstraintComponent').value:
        return `${this.getName(field)} requires a valid IRI.`

      default:
        return originalError
    }
  }

  onInput() {
    this.$emit('input', {
      subject: this.value.subject,
      data: this.data,
      targetClasses: this.definition.targetClasses,
    })
  }
}

</script>
