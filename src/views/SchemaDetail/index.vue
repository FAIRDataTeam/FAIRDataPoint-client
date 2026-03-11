<template>
  <div>
    <breadcrumbs
      v-if="status.isDefault()"
      :links="breadcrumbs"
      :current="title"
    />
    <page
      v-if="status.isDefault()"
      :title="title"
      content-only
      small
    >
      <status-flash :status="status" />
      <template #content>
        <ul
          class="nav nav-tabs mb-4"
        >
          <li
            class="nav-item"
          >
            <a
              class="nav-link"
              :class="{ active: !viewPreview }"
              @click.prevent="setViewPreview(false)"
            >
              Definition
            </a>
          </li>
          <li
            class="nav-item"
          >
            <a
              class="nav-link"
              :class="{ active: viewPreview }"
              @click.prevent="setViewPreview(true)"
            >
              Form Preview
            </a>
          </li>
        </ul>
        <div
          v-if="viewPreview"
        >
          <form-renderer
            v-if="!previewError"
            v-model="data"
            :definition="form"
            :validation-report="null"
          />
          <div
            v-else
            class="status-flash__alert status-flash__alert--danger"
          >
            Error while parsing the form definition:
            <br>
            {{ previewError }}
          </div>
        </div>
        <form
          v-else
          class="form"
        >
          <status-flash
            :status="submitStatus"
            no-loading
          />

          <div
            class="form__group"
            :class="{ 'form__group--error': v$.schema.name.$error }"
          >
            <label
              for="name"
              class="required"
            >
              Name
            </label>
            <input
              id="name"
              v-model.trim="v$.schema.name.$model"
              placeholder="Name"
              name="name"
            >
            <p
              v-if="!v$.schema.name.required"
              class="invalid-feedback"
            >
              Field is required
            </p>
          </div>

          <div
            class="form__group"
            :class="{ 'form__group--error': v$.schema.description.$error }"
          >
            <label for="description">
              Description
            </label>
            <textarea
              id="description"
              v-model.trim="v$.schema.description.$model"
              placeholder="Description"
              name="description"
            />
            <p
              v-if="!v$.schema.description.required"
              class="invalid-feedback"
            >
              Field is required
            </p>
          </div>

          <div
            class="form__group"
            :class="{ 'form__group--error': v$.schema.abstractSchema.$error }"
          >
            <label>
              <input
                id="abstractSchema"
                v-model.trim="v$.schema.abstractSchema.$model"
                name="abstractSchema"
                type="checkbox"
              >
              Abstract</label>
            <p
              v-if="!v$.schema.abstractSchema.required"
              class="invalid-feedback"
            >
              Field is required
            </p>
          </div>

          <div
            class="form__group"
            :class="{ 'form__group--error': v$.schema.extendsSchemaUuids.$error }"
          >
            <label>
              Extends
            </label>
            <ul>
              <li
                v-for="(v, index) in v$.schema.extendsSchemaUuids.$each.$iter"
                :key="`target-class-${index}`"
                data-cy="target-class"
              >
                <div class="d-flex align-items-start">
                  <div
                    class="form__group flex-grow-1"
                    :class="{ 'form__group--error': v.uuid.$error }"
                  >
                    <select
                      v-model="schema.extendsSchemaUuids[index].uuid"
                      :name="`extendsSchemaUuids.${index}.uuid`"
                    >
                      <option
                        v-for="schemaOption in schemaOptions"
                        :key="schemaOption.key"
                        :value="schemaOption.key"
                      >
                        {{ schemaOption.value }}
                      </option>
                    </select>
                    <p
                      v-if="!v.uuid.required"
                      class="invalid-feedback"
                    >
                      Field cannot be empty
                    </p>
                  </div>
                  <a
                    class="text-danger ms-3 p-1"
                    :data-cy="`extendsSchemaUuids.${index}.remove`"
                    @click.prevent="removeExtends(index)"
                  >
                    <fa :icon="['fas', 'times']" />
                  </a>
                </div>
              </li>
            </ul>
            <p
              v-if="!v$.schema.extendsSchemaUuids.required"
              class="invalid-feedback"
            >
              You should specify at least one shape
            </p>
            <button
              class="btn btn-link"
              data-cy="add-shape"
              @click.prevent="addExtends()"
            >
              <fa :icon="['fas', 'plus']" />
              Add
            </button>
          </div>

          <div
            v-if="!schema.abstractSchema"
            class="form__group"
            :class="{ 'form__group--error': v$.schema.suggestedResourceName.$error }"
          >
            <label for="description">
              Suggested Resource Name
            </label>
            <input
              id="suggestedResourceName"
              v-model.trim="v$.schema.suggestedResourceName.$model"
              name="suggestedResourceName"
            >
          </div>

          <div
            v-if="!schema.abstractSchema"
            class="form__group"
            :class="{ 'form__group--error': v$.schema.suggestedUrlPrefix.$error }"
          >
            <label for="description">
              Suggested URL Prefix
            </label>
            <input
              id="suggestedUrlPrefix"
              v-model.trim="v$.schema.suggestedUrlPrefix.$model"
              name="suggestedUrlPrefix"
            >
          </div>

          <div
            class="form__group"
            :class="{ 'form__group--error': v$.schema.definition.$error }"
          >
            <label class="required">
              Form Definition
            </label>
            <prism-editor
              id="schema-definition"
              v-model="v$.schema.definition.$model"
              language="turtle"
            />
            <p
              v-if="!v$.schema.definition.required"
              class="invalid-feedback"
            >
              Field is required
            </p>
          </div>

          <div>
            <button
              class="btn btn-primary btn-rounded"
              :disabled="status.isPending()"
              data-cy="save"
              @click.prevent="save"
            >
              Save
            </button>
            <button
              class="btn btn-primary btn-rounded ms-2"
              :disabled="status.isPending()"
              data-cy="save-release"
              @click.prevent="release"
            >
              Save and release
            </button>
          </div>
        </form>
      </template>
    </page>
  </div>
</template>
<script lang="ts">
import { useVuelidate } from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import PrismEditor from '@/components/PrismEditor/index.vue'
import _ from 'lodash'
import { SHACLFormParser } from '@/components/ShaclForm/Parser/SHACLFormParser'
import FormRenderer from '@/components/ShaclForm/FormRenderer.vue'
import api from '../../api'
import Status from '../../utils/Status'
import Breadcrumbs from '../../components/Breadcrumbs/index.vue'
import Page from '../../components/Page/index.vue'
import StatusFlash from '../../components/StatusFlash/index.vue'

export default {
  name: 'SchemaDetail',
  components: {
    FormRenderer,
    Breadcrumbs,
    Page,
    PrismEditor,
    StatusFlash,
  },
  setup() {
    return { v$: useVuelidate() }
  },

  data() {
    return {
      errors: [],
      schema: {
        name: null,
        description: null,
        abstractSchema: false,
        definition: null,
        extendsSchemaUuids: [],
        suggestedResourceName: null,
        suggestedUrlPrefix: null,
      },
      status: new Status(),
      submitStatus: new Status(),
      schemas: [],
      schemaOptions: [],
      breadcrumbs: [{
        label: 'Metadata Schemas',
        to: '/schemas',
      }],
      currentSchema: null,
      viewPreview: false,
      form: null,
      previewError: null,
      data: { subject: null, data: {} },
    }
  },

  computed: {
    isEdit() {
      return !!this.$route.params.uuid
    },

    title() {
      return this.currentSchema
        ? `Edit ${this.currentSchema.name}`
        : 'Create Metadata Schema'
    },
  },

  validations() {
    return {
      schema: {
        name: { required },
        description: {},
        abstractSchema: {},
        definition: { required },
        extendsSchemaUuids: {
          $each: helpers.forEach({
            uuid: { required },
          }),
        },
        suggestedResourceName: {},
        suggestedUrlPrefix: {},
      },
    }
  },

  watch: {
    $route: 'fetchData',
  },

  created() {
    this.fetchData()
  },

  methods: {
    getSchemaVersions(schemaUuid) {
      return this.schemas.reduce((acc, schema) => {
        if (schema.uuid === schemaUuid) {
          return schema.versions
        }
        return acc
      }, [])
    },

    async fetchData() {
      try {
        this.status.setPending()
        const schemas = await api.metadataSchemas.getForExtend()
        this.schemas = schemas.data
        this.schemaOptions = _.orderBy(schemas.data, ['name'], ['asc'])
          .map((schema) => ({ key: schema.uuid, value: schema.name }))
        this.schemaOptions.unshift({ key: null, value: '- select -' })

        if (this.isEdit) {
          const schema = await api.metadataSchemas.getDraft(this.$route.params.uuid)
          this.schema = this.requestDataToFormData(schema.data)
          this.currentSchema = schema.data
        }

        this.status.setDone()
      } catch (error) {
        this.status.setError('Unable to get schema')
      }
    },

    async release() {
      await this.submit(true)
    },

    async save() {
      await this.submit(false)
    },

    async submit(release) {
      this.v$.schema.$touch()

      if (!this.v$.schema.$invalid) {
        this.submitStatus.setPending()
        this.errors = []
        try {
          const request = this.isEdit
            ? api.metadataSchemas.putDraft
            : api.metadataSchemas.post
          const schema = await request(this.formDataToRequestData(this.schema))
          const nextRoute = release ? `/schemas/${schema.data.uuid}/release` : '/schemas'
          await this.$router.push(nextRoute)
        } catch (error) {
          const errors = _.get(error, 'response.data.errors')

          if (errors) {
            this.submitStatus.setError('Unable to save schema')
            this.errors = errors
          } else {
            this.submitStatus.setErrorFromResponse(error, 'Schema could not be saved.')
          }
        } finally {
          window.scrollTo(0, 0)
        }
      }
    },

    formDataToRequestData(formData) {
      const data = { ...formData }
      data.extendsSchemaUuids = formData.extendsSchemaUuids.map(({ uuid }) => uuid)
      data.description = formData.description || ''
      return data
    },

    requestDataToFormData(requestData) {
      const formData = { ...requestData }
      formData.extendsSchemaUuids = requestData.extendsSchemaUuids.map((uuid) => ({ uuid }))
      return formData
    },

    addExtends() {
      this.schema.extendsSchemaUuids.push({ uuid: null, version: null })
    },

    removeExtends(index) {
      this.schema.extendsSchemaUuids.splice(index, 1)
    },

    setViewPreview(viewPreview) {
      if (viewPreview) {
        try {
          this.previewError = null
          this.data = { subject: null, data: {} }

          const parser = new SHACLFormParser(this.schema.definition)
          this.form = {
            targetClasses: [],
            groups: parser.parseAllAndGroup(),
          }
        } catch (error) {
          this.previewError = error
        }
      }

      this.viewPreview = viewPreview
    },
  },
}
</script>
