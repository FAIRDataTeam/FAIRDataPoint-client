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
      <template #content>
        <status-flash :status="status" />
        <ul
          class="nav nav-tabs mb-4"
        >
          <li
            class="nav-item"
          >
            <a
              class="nav-link"
              :class="{'active': !viewPreview}"
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
              :class="{'active': viewPreview}"
              @click.prevent="setViewPreview(true)"
            >
              Form Preview
            </a>
          </li>
        </ul>
        <div
          v-if="viewPreview"
        >
          <status-flash :status="previewStatus" />
          <form-renderer
            v-if="previewStatus.isDefault()"
            v-model="data"
            :definition="form"
            :validation-report="null"
          />
        </div>
        <form
          v-else
          class="form"
          @submit.prevent="submit"
        >
          <status-flash
            :status="submitStatus"
            no-loading
          />

          <div
            class="form__group"
            :class="{'form__group--error': $v.resourceDefinition.name.$error}"
          >
            <label
              for="name"
              class="required"
            >
              Name
            </label>
            <input
              id="name"
              v-model.trim="$v.resourceDefinition.name.$model"
              placeholder="Name"
              name="name"
            >
            <p
              v-if="!isEdit && suggestedResourceNames.length > 0"
              class="form__group__suggestions"
            >
              Suggestions:
              <a
                v-for="suggestedResourceName in suggestedResourceNames"
                :key="suggestedResourceName"
                class="link"
                @click.prevent="setName(suggestedResourceName)"
              >
                {{ suggestedResourceName }}
              </a>
            </p>
            <p
              v-if="!$v.resourceDefinition.name.required"
              class="invalid-feedback"
            >
              Field is required
            </p>
          </div>

          <div
            class="form__group"
            :class="{'form__group--error': $v.resourceDefinition.urlPrefix.$error}"
          >
            <label for="urlPrefix">URL Prefix</label>
            <input
              id="urlPrefix"
              v-model.trim="$v.resourceDefinition.urlPrefix.$model"
              placeholder="URL prefix"
              name="urlPrefix"
              :disabled="isEdit"
            >
            <p
              v-if="!isEdit && suggestedUrlPrefixes.length > 0"
              class="form__group__suggestions"
            >
              Suggestions:
              <a
                v-for="suggestedUrlPrefix in suggestedUrlPrefixes"
                :key="suggestedUrlPrefix"
                class="link"
                @click.prevent="setUrlPrefix(suggestedUrlPrefix)"
              >
                {{ suggestedUrlPrefix }}
              </a>
            </p>
            <p
              v-if="!$v.resourceDefinition.urlPrefix.uniqueness"
              class="invalid-feedback"
            >
              This URL Prefix is already used
            </p>
          </div>

          <div
            class="form__group"
            :class="{'form__group--error': $v.resourceDefinition.metadataSchemaUuids.$error}"
          >
            <label
              for="urlPrefix"
              class="required"
            >
              Metadata Schemas
            </label>
            <ul>
              <li
                v-for="(v, index) in $v.resourceDefinition.metadataSchemaUuids.$each.$iter"
                :key="`target-class-${index}`"
                data-cy="target-class"
              >
                <div class="d-flex align-items-start">
                  <div
                    class="form__group flex-grow-1"
                    :class="{'form__group--error': v.uuid.$error}"
                  >
                    <select
                      v-model="resourceDefinition.metadataSchemaUuids[index].uuid"
                      :name="`metadataSchemaUuids.${index}.uuid`"
                    >
                      <option
                        v-for="metadataSchema in metadataSchemaOptions"
                        :key="metadataSchema.key"
                        :value="metadataSchema.key"
                      >
                        {{ metadataSchema.value }}
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
                    class="text-danger ml-3 p-1"
                    :data-cy="`metadataSchemaUuids.${index}.remove`"
                    @click.prevent="removeMetadataSchemaUuid(index)"
                  >
                    <fa :icon="['fas', 'times']" />
                  </a>
                </div>
              </li>
            </ul>
            <p
              v-if="!$v.resourceDefinition.metadataSchemaUuids.required"
              class="invalid-feedback"
            >
              You should specify at least one metadata schema
            </p>
            <button
              class="btn btn-link"
              data-cy="add-metadata-schema"
              @click.prevent="addMetadataSchemaUuid()"
            >
              <fa :icon="['fas', 'plus']" />
              Add
            </button>
          </div>

          <div class="form__group">
            <label>Children</label>
            <ul>
              <li
                v-for="(v, index) in $v.resourceDefinition.children.$each.$iter"
                :key="`child-${index}`"
                data-cy="child"
              >
                <div class="d-flex align-items-start">
                  <div class="flex-grow-1">
                    <div
                      class="form__group"
                      :class="{'form__group--error': v.relationUri.$error}"
                    >
                      <label
                        :for="`child.${index}.resource`"
                        class="required"
                      >
                        Child Resource
                      </label>
                      <select
                        v-model="resourceDefinition.children[index].resourceDefinitionUuid"
                        :name="`child.${index}.resource`"
                      >
                        <option
                          v-for="resource in resourceOptions"
                          :key="resource.key"
                          :value="resource.key"
                        >
                          {{ resource.value }}
                        </option>
                      </select>
                      <p
                        v-if="!v.resourceDefinitionUuid.required"
                        class="invalid-feedback"
                      >
                        Field is required
                      </p>
                    </div>

                    <div
                      class="form__group"
                      :class="{'form__group--error': v.relationUri.$error}"
                    >
                      <label
                        :for="`child.${index}.relationUri`"
                        class="required"
                      >
                        Child Relation URI
                      </label>
                      <input
                        v-model.trim="v.relationUri.$model"
                        placeholder="Child Relation URI"
                        :name="`child.${index}.relationUri`"
                      >
                      <p
                        v-if="!v.relationUri.required"
                        class="invalid-feedback"
                      >
                        Field is required
                      </p>
                      <p
                        v-if="!v.relationUri.url"
                        class="invalid-feedback"
                      >
                        Field should be a valid IRI
                      </p>
                    </div>

                    <div
                      class="form__group"
                      :class="{'form__group--error': v.listView.title.$error}"
                    >
                      <label
                        :for="`child.${index}.listViewTitle`"
                        class="required"
                      >Child List View Title</label>
                      <input
                        v-model.trim="v.listView.title.$model"
                        placeholder="Child Relation URI"
                        :name="`child.${index}.listViewTitle`"
                      >
                      <p
                        v-if="!v.listView.title.required"
                        class="invalid-feedback"
                      >
                        Field is required
                      </p>
                    </div>

                    <div
                      class="form__group"
                      :class="{'form__group--error': v.listView.tagsUri.$error}"
                    >
                      <label :for="`child.${index}.listViewTagsUri`">
                        Child List View Tags URI
                      </label>
                      <input
                        v-model.trim="v.listView.tagsUri.$model"
                        placeholder="Child Relation URI"
                        :name="`child.${index}.listViewTagsUri`"
                      >
                      <p
                        v-if="!v.listView.tagsUri.url"
                        class="invalid-feedback"
                      >
                        Field should be a valid IRI
                      </p>
                    </div>

                    <div
                      class="form__group"
                      :class="{'form__group--error': v.listView.metadata.$error}"
                    >
                      <label>Child List View Metadata</label>
                      <ul>
                        <li
                          v-for="(vm, indexm) in v.listView.metadata.$each.$iter"
                          :key="`metadata-${indexm}`"
                          data-cy="metadata"
                        >
                          <div class="d-flex align-items-start">
                            <div class="flex-grow-1">
                              <input
                                v-model.trim="vm.title.$model"
                                placeholder="Title"
                                :name="`child.${index}.metadata.${indexm}.title`"
                                class="input-field"
                              >
                              <input
                                v-model.trim="vm.propertyUri.$model"
                                placeholder="Property URI"
                                :name="`child.${index}.metadata.${indexm}.propertyUri`"
                                class="input-field"
                              >
                              <p
                                v-if="!vm.propertyUri.url"
                                class="invalid-feedback"
                              >
                                Field should be a valid IRI
                              </p>
                            </div>
                            <a
                              class="text-danger ml-3 p-1"
                              :data-cy="`child.${index}.metadata.${indexm}.remove`"
                              @click.prevent="removeMetadata(index, indexm)"
                            >
                              <fa :icon="['fas', 'times']" />
                            </a>
                          </div>
                        </li>
                      </ul>
                      <button
                        class="btn btn-link"
                        data-cy="add-metadata"
                        @click.prevent="addMetadata(index)"
                      >
                        <fa :icon="['fas', 'plus']" />
                        Add
                      </button>
                    </div>
                  </div>
                  <a
                    class="text-danger ml-3 p-1"
                    :data-cy="`child.${index}.remove`"
                    @click.prevent="removeChild(index)"
                  >
                    <fa :icon="['fas', 'times']" />
                  </a>
                </div>
              </li>
            </ul>

            <button
              class="btn btn-link"
              data-cy="add-child"
              @click.prevent="addChild()"
            >
              <fa :icon="['fas', 'plus']" />
              Add
            </button>
          </div>

          <div
            class="form__group"
            :class="{'form__group--error': $v.resourceDefinition.externalLinks.$error}"
          >
            <label>External links</label>
            <ul>
              <li
                v-for="(v, index) in $v.resourceDefinition.externalLinks.$each.$iter"
                :key="`external-link-${index}`"
                data-cy="external-link"
              >
                <div class="d-flex align-items-start">
                  <div class="flex-grow-1">
                    <input
                      v-model.trim="v.title.$model"
                      placeholder="Title"
                      :name="`externalLink.${index}.title`"
                      class="input-field"
                    >
                    <p
                      v-if="!v.title.required"
                      class="invalid-feedback"
                    >
                      Field is required
                    </p>
                    <input
                      v-model.trim="v.propertyUri.$model"
                      placeholder="Property URI"
                      :name="`externalLink.${index}.propertyUri`"
                      class="input-field"
                    >
                    <p
                      v-if="!v.propertyUri.required"
                      class="invalid-feedback"
                    >
                      Field is required
                    </p>
                    <p
                      v-if="!v.propertyUri.url"
                      class="invalid-feedback"
                    >
                      Field should be a valid IRI
                    </p>
                  </div>
                  <a
                    class="text-danger ml-3 p-1"
                    :data-cy="`externalLink.${index}.remove`"
                    @click.prevent="removeExternalLink(index)"
                  >
                    <fa :icon="['fas', 'times']" />
                  </a>
                </div>
              </li>
            </ul>
            <button
              class="btn btn-link"
              data-cy="add-external-link"
              @click.prevent="addExternalLink()"
            >
              <fa :icon="['fas', 'plus']" />
              Add
            </button>
          </div>

          <div>
            <button
              class="btn btn-primary btn-rounded"
              :disabled="status.isPending()"
              data-cy="save"
            >
              Save
            </button>
          </div>
        </form>
      </template>
    </page>
  </div>
</template>
<script lang="ts">
import { required, url } from 'vuelidate/lib/validators'
import axios from 'axios'
import _ from 'lodash'
import config from '@/config'
import { SHACLFormParser } from '@/components/ShaclForm/Parser/SHACLFormParser'
import FormRenderer from '@/components/ShaclForm/FormRenderer.vue'
import api from '../../api'
import Breadcrumbs from '../../components/Breadcrumbs/index.vue'
import Page from '../../components/Page/index.vue'
import StatusFlash from '../../components/StatusFlash/index.vue'
import Status from '../../utils/Status'

export default {
  name: 'ResourceDefinitionCreate',
  components: {
    Breadcrumbs,
    FormRenderer,
    Page,
    StatusFlash,
  },

  data() {
    return {
      errors: [],
      resourceDefinition: {
        name: null,
        urlPrefix: null,
        metadataSchemaUuids: [],
        children: [],
        externalLinks: [],
      },
      status: new Status(),
      submitStatus: new Status(),
      resourceOptions: [],
      breadcrumbs: [{
        label: 'Resource definitions',
        to: '/resource-definitions',
      }],
      currentResourceDefinition: null,
      viewPreview: false,
      form: null,
      previewError: null,
      data: { subject: null, data: {} },
      previewStatus: new Status(),
    }
  },

  computed: {
    isEdit() {
      return !!this.$route.params.uuid
    },

    title() {
      return this.currentResourceDefinition
        ? `Edit ${this.currentResourceDefinition.name}`
        : 'Create resource definition'
    },

    suggestedResourceNames() {
      return this.resourceDefinition.metadataSchemaUuids
        .map((ms) => this.findSchema(ms.uuid)?.latest?.suggestedResourceName)
        .filter((suggestedName) => !!suggestedName)
    },

    suggestedUrlPrefixes() {
      return this.resourceDefinition.metadataSchemaUuids
        .map((ms) => this.findSchema(ms.uuid)?.latest?.suggestedUrlPrefix)
        .filter((suggestedUrlPrefix) => !!suggestedUrlPrefix)
    },
  },

  validations() {
    return {
      resourceDefinition: {
        name: { required },
        urlPrefix: {
          uniqueness: (value) => {
            const error = this.errors.find((e) => e.field === 'urlPrefix')
            const code = _.get(error, 'code')
            const rejectedValue = _.get(error, 'rejectedValue')
            return !(code === 'Uniqueness' && rejectedValue === value)
          },
        },
        metadataSchemaUuids: {
          required,
          $each: {
            uuid: { required },
          },
        },
        children: {
          $each: {
            resourceDefinitionUuid: { required },
            relationUri: { required, url },
            listView: {
              title: { required },
              tagsUri: { url },
              metadata: {
                $each: {
                  title: { required },
                  propertyUri: { required, url },
                },
              },
            },
          },
        },
        externalLinks: {
          $each: {
            title: { required },
            propertyUri: { required, url },
          },
        },
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
    async fetchData() {
      try {
        this.status.setPending()
        const [resourceDefinitions, metadataSchemas] = await this.loadData()

        this.resourceOptions = _.orderBy(resourceDefinitions.data, ['name'], ['asc'])
          .map((resource) => ({ key: resource.uuid, value: resource.name }))
        this.resourceOptions.unshift({ key: null, value: '- select -' })

        this.metadataSchemas = metadataSchemas.data
        this.metadataSchemaOptions = _.orderBy(metadataSchemas.data, ['name'], ['asc'])
          .map((metadataSchema) => ({ key: metadataSchema.uuid, value: metadataSchema.name }))
        this.metadataSchemaOptions.unshift({ key: null, value: '- select -' })

        if (this.isEdit) {
          const resourceDefinition = _.first(
            resourceDefinitions.data.filter((r) => r.uuid === this.$route.params.uuid),
          )
          if (resourceDefinition) {
            this.resourceDefinition = this.requestDataToFormData(resourceDefinition)
            this.currentResourceDefinition = resourceDefinition
          }
        }

        this.status.setDone()
      } catch (error) {
        this.status.setError('Unable to get metadata schemas')
      }
    },

    async loadData() {
      return axios.all([
        api.resourceDefinition.getResourceDefinitions(),
        api.metadataSchemas.getForResource(),
      ])
    },

    async submit() {
      this.$v.resourceDefinition.$touch()

      if (!this.$v.resourceDefinition.$invalid) {
        this.submitStatus.setPending()
        this.errors = []
        try {
          const request = this.isEdit
            ? api.resourceDefinition.putResourceDefinition
            : api.resourceDefinition.postResourceDefinition
          await request(this.formDataToRequestData(this.resourceDefinition))
          // full reload is necessary after changing resource definitions
          window.location.href = `${config.publicPath}/resource-definitions`
        } catch (error) {
          const errors = _.get(error, 'response.data.errors')

          if (errors) {
            this.submitStatus.setError('Unable to save resource definition')
            this.errors = errors
          } else {
            this.submitStatus.setErrorFromResponse(error, 'Resource definition could not be saved.')
          }
          window.scrollTo(0, 0)
        }
      }
    },

    formDataToRequestData(formData) {
      const data = { ...formData }
      data.metadataSchemaUuids = _.uniq(formData.metadataSchemaUuids.map((u) => u.uuid))
      return data
    },

    requestDataToFormData(requestData) {
      const formData = { ...requestData }
      formData.metadataSchemaUuids = requestData.metadataSchemaUuids.map((uuid) => ({ uuid }))
      return formData
    },

    setName(name) {
      this.resourceDefinition.name = name
    },

    setUrlPrefix(urlPrefix) {
      this.resourceDefinition.urlPrefix = urlPrefix
    },

    addChild() {
      this.resourceDefinition.children.push({
        resourceDefinitionUuid: null,
        relationUri: null,
        listView: {
          title: null,
          tagsUri: null,
          metadata: [],
        },
      })
    },

    removeChild(index) {
      this.resourceDefinition.children.splice(index, 1)
    },

    addMetadataSchemaUuid() {
      this.resourceDefinition.metadataSchemaUuids.push({ uuid: null })
    },

    removeMetadataSchemaUuid(index) {
      this.resourceDefinition.metadataSchemaUuids.splice(index, 1)
    },

    addMetadata(childIndex) {
      this.resourceDefinition.children[childIndex].listView.metadata.push({
        title: null,
        propertyUri: null,
      })
    },

    removeMetadata(childIndex, index) {
      this.resourceDefinition.children[childIndex].listView.metadata.splice(index, 1)
    },

    addExternalLink() {
      this.resourceDefinition.externalLinks.push({ title: null, propertyUri: null })
    },

    removeExternalLink(index) {
      this.resourceDefinition.externalLinks.splice(index, 1)
    },

    findSchema(uuid) {
      return this.metadataSchemas.find((schema) => schema.uuid === uuid)
    },

    setViewPreview(viewPreview) {
      if (viewPreview) {
        this.fetchPreview()
      }

      this.viewPreview = viewPreview
    },

    async fetchPreview() {
      try {
        this.previewStatus.setPending()

        const uuids = this.resourceDefinition.metadataSchemaUuids.map((uuid) => uuid.uuid)
        const preview = await api.metadataSchemas.postPreview(uuids)
        const parser = new SHACLFormParser(preview.data)
        this.data = { subject: null, data: {} }
        this.form = {
          targetClasses: [],
          groups: parser.parseAllAndGroup(),
        }

        this.previewStatus.setDone()
      } catch (error) {
        this.previewStatus.setErrorFromResponse(error, 'Unable to get preview')
      }
    },
  },
}
</script>
