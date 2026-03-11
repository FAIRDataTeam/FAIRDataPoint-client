<template>
  <form
    class="form"
    @submit.prevent="submit"
  >
    <div
      v-for="field in spec.fields"
      :key="field.id"
      class="form__group"
      :class="{ 'form__group--error': hasError(field.id) }"
    >
      <label
        :for="field.id"
        :class="{ required: field.required }"
      >
        {{ field.label }}
      </label>
      <template v-if="field.multiple">
        <ul>
          <li
            v-for="(v, index) in v$.model[field.id].$each.$iter"
            :key="`${field.id}.${index}`"
            class="form__group__input-item"
            :class="{ 'form__group__input-item--error': v.value.$error }"
          >
            <div class="d-flex">
              <input
                v-model.trim="v.value.$model"
              >
              <a
                class="text-danger ms-3 p-1"
                @click="model[field.id].splice(index, 1)"
              >
                <fa :icon="['fas', 'times']" />
              </a>
            </div>
            <p
              v-if="v.value.required === false"
              class="invalid-feedback"
            >
              Field is required
            </p>
            <p
              v-if="v.value.url === false"
              class="invalid-feedback"
            >
              This is not a valid IRI
            </p>
          </li>
        </ul>
        <button
          class="btn btn-outline-secondary btn-rounded"
          @click.prevent="model[field.id].push({ value: '' })"
        >
          Add
        </button>
      </template>
      <template v-else-if="field.type === 'xor'">
        <div class="form__group__xor-options">
          <label
            v-for="option in field.options"
            :key="`radio-${option.id}`"
          >
            <input
              v-model="v$.model[field.id].$model"
              type="radio"
              :name="field.id"
              :value="option.id"
            >
            {{ option.label }}
          </label>
        </div>
        <template v-for="option in field.options.filter(o => o.id === model[field.id])">
          <input
            :id="option.id"
            :key="`input-${option.id}`"
            v-model.trim="v$.model[option.id].$model"
            :name="option.id"
            :placeholder="option.label"
          >
          <p
            v-if="v$.model[option.id].required === false"
            :key="`err-req-${option.id}`"
            class="invalid-feedback"
          >
            Field is required
          </p>
          <p
            v-if="v$.model[option.id].url === false"
            :key="`err-url-${option.id}`"
            class="invalid-feedback"
          >
            This is not a valid IRI
          </p>
        </template>
      </template>
      <template v-else>
        <textarea
          v-if="field.type === 'text'"
          :id="field.id"
          v-model.trim="v$.model[field.id].$model"
          :name="field.id"
          :placeholder="field.label"
        />
        <input
          v-else
          :id="field.id"
          v-model.trim="v$.model[field.id].$model"
          :name="field.id"
          :placeholder="field.label"
        >
        <p
          v-if="v$.model[field.id].required === false"
          class="invalid-feedback"
        >
          Field is required
        </p>
        <p
          v-if="v$.model[field.id].url === false"
          class="invalid-feedback"
        >
          This is not a valid IRI
        </p>
      </template>
    </div>
    <div>
      <button
        class="btn btn-primary btn-rounded"
        data-cy="save"
      >
        Save
      </button>
    </div>
  </form>
</template>
<script lang="ts">
import { useVuelidate } from '@vuelidate/core'
import * as validation from '@vuelidate/validators'

export default {
  name: 'FormGenerator',

  props: {
    spec: {
      type: Object,
      required: true,
    },
    entity: {
      type: Object,
      required: true,
    },
    onSubmit: {
      type: Function,
      required: true,
    },
  },
  setup() {
    return { v$: useVuelidate() }
  },

  data() {
    return {
      model: this.createModel(),
    }
  },

  validations() {
    const createFieldValidations = (field) => {
      let fieldValidations = {}
      let nestedFieldValidations = {}

      if (field.required) {
        fieldValidations = { ...fieldValidations, required: validation.required }
      }

      if (field.type === 'iri') {
        fieldValidations = { ...fieldValidations, url: validation.url }
      }

      if (field.type === 'xor') {
        nestedFieldValidations = field.options.reduce((validations, option) => ({
          ...validations,
          ...createFieldValidations({
            ...option,
            required: this.model[field.id] === option.id && field.required,
          }),
        }), {})
      }

      if (field.multiple) {
        fieldValidations = { $each: validation.helpers.forEach({ value: fieldValidations }) }
      }

      return { [field.id]: fieldValidations, ...nestedFieldValidations }
    }

    return {
      model: this.spec.fields.reduce((validations, field) => {
        const fieldValidations = createFieldValidations(field)
        return { ...validations, ...fieldValidations }
      }, {}),
    }
  },

  methods: {
    hasError(fieldId) {
      const isXor = this.spec.fields.filter((f) => f.id === fieldId && f.type === 'xor').length > 0
      const optionError = isXor ? this.v$.model[this.model[fieldId]].$error : false
      return this.v$.model[fieldId].$error || optionError
    },

    submit() {
      this.v$.model.$touch()

      if (!this.v$.model.$invalid) {
        this.onSubmit(this.getSanitizedModel())
      }
    },

    createModel() {
      const model = { ...this.entity }
      this.spec.fields.filter((f) => f.type === 'xor').forEach((field) => {
        model[field.id] = field.options.reduce(
          (selected, option) => (model[option.id] ? option.id : selected),
          field.options[0].id,
        )
      })
      return model
    },

    getSanitizedModel() {
      const model = { ...this.model }
      this.spec.fields.filter((f) => f.type === 'xor').forEach((field) => {
        const value = model[field.id]

        field.options.forEach((option) => {
          if (option.id !== value) {
            model[option.id] = null
          }
        })

        delete model[field.id]
      })

      return model
    },
  },
}
</script>
