<template>
  <div
    :key="componentKey"
    class="form form-renderer"
  >
    <div
      v-for="group in definition.groups"
      :key="`${group.iri}`"
      :class="{ 'shacl-group': !!group.label }"
    >
      <h2 v-if="group.label">
        {{ group.label }}
      </h2>
      <p v-if="group.comment">
        {{ group.comment }}
      </p>
      <div
        v-for="field in group.fields"
        :key="`${field.path}`"
        :class="{ form__group: true, 'form__group--error': getError(field) }"
      >
        <label :class="{ required: isRequired(field) }">{{ getName(field) }}</label>
        <p
          v-if="isList(field) && field.description"
          class="field-description"
        >
          {{ field.description }}
        </p>
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
                :definition="wrapNodeShape(field.nodeShape)"
                :validation-report="validationReport"
                @update:modelValue="onInput(field)"
              />
              <form-input
                v-else
                v-model="data[field.path][i]"
                :field="field"
                @update:modelValue="onInput(field)"
              />
              <a
                v-if="canBeRemoved(field)"
                class="text-danger ms-3 p-1"
                @click="removeValue(field, i)"
              >
                <fa :icon="['fas', 'times']" />
              </a>
            </div>
          </component>
        </component>
        <p
          v-if="!isList(field) && field.description"
          class="field-description"
        >
          {{ field.description }}
        </p>
        <button
          v-if="isList(field)"
          class="btn btn-link"
          :hidden="!canAddValue(field)"
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
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import * as $rdf from 'rdflib'
import _ from 'lodash'
import FormInput from '@/components/ShaclForm/FormInput.vue'
import fieldUtils from '@/components/ShaclForm/fieldUtils'
import { ValidationReport } from '@/components/ShaclForm/Parser/ValidationReport'
import { SHACL } from '@/rdf/namespaces'

export default defineComponent({
  name: 'FormRenderer',
  components: { FormInput },
  props: {
    definition: { type: Object, required: true },
    subject: { type: [String, Object], required: false, default: () => $rdf.blankNode(null) },
    validationReport: { type: Object as PropType<ValidationReport>, required: true },
    modelValue: { type: Object, required: true },
  },
  emits: ['update:modelValue', 'input'],
  data() {
    return {
      data: null,
      componentKey: 0,
      dirtyFields: new Set<string>(),
    }
  },
  created(): void {
    this.dirtyFields = new Set<string>()
    this.data = this.definition.groups.reduce((acc, group) => {
      group.fields.forEach((field) => {
        acc[field.path] = _.get(
          this.modelValue.data,
          field.path,
          this.createDefaultValueArray(field),
        )
      })
      return acc
    }, {})
    this.onInput()
  },
  methods: {
    wrapNodeShape(nodeShape) {
      return {
        groups: [{
          fields: nodeShape.fields,
          isReal: false,
        }],
        targetClasses: nodeShape.targetClasses,
      }
    },
    createDefaultValue(field) {
      if (field.nodeShape) {
        return {
          subject: $rdf.blankNode(null),
          data: {},
        }
      }

      return ''
    },
    createDefaultValueArray(field) {
      if (field.minCount === 1 || (field.maxCount === 1 && !fieldUtils.isOptionalNode(field))) {
        return [this.createDefaultValue(field)]
      }

      return []
    },
    getName(field) {
      return fieldUtils.getName(field)
    },
    isRequired(field) {
      return fieldUtils.isRequired(field)
    },
    isList(field) {
      return fieldUtils.isList(field) || fieldUtils.isOptionalNode(field)
    },
    canBeRemoved(field) {
      const count = this.data[field.path].length
      const minCount = _.get(field, 'minCount', 0)
      return this.isList(field) && count > minCount
    },
    canAddValue(field) {
      const count = this.data[field.path].length
      const maxCount: number | null = _.get(field, 'maxCount', null)
      return maxCount === null || count < maxCount
    },
    addValue(field) {
      this.data[field.path].push(this.createDefaultValue(field))
    },
    removeValue(field, index) {
      this.data[field.path].splice(index, 1)
      this.componentKey += 1
      this.onInput(field)
    },
    isDirty(field) {
      return this.dirtyFields.has(field.path)
    },
    cleanDirty() {
      this.dirtyFields = new Set<string>()
    },
    getError(field) {
      if (this.isDirty(field)) {
        return this.getLocalError(field)
      }
      const subject = `${this.subject}`
      if (_.has(this.validationReport, subject)) {
        return this.humanReadableError(field, this.validationReport[subject][field.path])
      }
      return null
    },
    getLocalError(field) {
      const valueString = _.get(this.data[field.path], '0.value', `${this.data[field.path]}`)

      if (valueString === null) {
        return null
      }

      const values = valueString.split(',')
      for (let i = 0; i < values.length; i += 1) {
        const value = values[i]

        if (field.minLength && value.length < field.minLength) {
          return `${this.getName(field)} should be at least ${field.minLength} characters.`
        }

        if (field.maxLength && value.length > field.maxLength) {
          return `${this.getName(field)} should be at most ${field.maxLength} characters.`
        }

        if (field.in && field.in.indexOf(value) === -1) {
          return `${this.getName(field)} should contain one of the values: ${field.in.join(', ')}.`
        }
      }

      return null
    },
    humanReadableError(field, originalError) {
      switch (originalError) {
        case SHACL('MinCountConstraintComponent').value:
          return `${this.getName(field)} is required.`

        case SHACL('NodeKindConstraintComponent').value:
          return `${this.getName(field)} requires a valid IRI.`

        case SHACL('MinLengthConstraintComponent').value:
          return `${this.getName(field)} should be at least ${field.minLength} characters.`

        case SHACL('MaxLengthConstraintComponent').value:
          return `${this.getName(field)} should be at most ${field.maxLength} characters.`

        case SHACL('InConstraintComponent').value:
          return `${this.getName(field)} should contain one of the values: ${field.in.join(', ')}.`

        default:
          return originalError
      }
    },
    onInput(field = null) {
      if (field) {
        this.dirtyFields.add(field.path)
      }

      const payload = {
        subject: this.modelValue.subject,
        data: this.data,
        targetClasses: this.definition.targetClasses,
      }
      this.$emit('update:modelValue', payload)
      this.$emit('input', payload)
    },
  },
})

</script>
