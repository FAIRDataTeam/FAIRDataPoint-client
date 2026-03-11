<template>
  <div>
    <breadcrumbs
      v-if="status.isDefault()"
      :links="breadcrumbs"
      current="Release"
    />
    <page
      v-if="status.isDefault()"
      title="Release version"
      content-only
      small
    >
      <status-flash :status="status" />
      <template #content>
        <form
          class="form"
        >
          <status-flash
            :status="submitStatus"
            no-loading
          />

          <div
            class="form__group"
            :class="{ 'form__group--error': v$.version.description.$error }"
          >
            <label for="description">
              Description
            </label>
            <textarea
              id="description"
              v-model.trim="v$.version.description.$model"
              placeholder="Description"
              name="description"
            />
            <p
              v-if="!v$.version.description.required"
              class="invalid-feedback"
            >
              Field is required
            </p>
          </div>

          <div
            class="form__group"
            :class="{ 'form__group--error': v$.version.description.$error }"
          >
            <label for="description">
              Version
            </label>
            <div class="version-input">
              <input
                id="major"
                v-model.trim="v$.version.major.$model"
                type="number"
                placeholder="major"
                name="major"
              >
              <input
                id="minor"
                v-model.trim="v$.version.minor.$model"
                type="number"
                placeholder="minor"
                name="minor"
              >
              <input
                id="patch"
                v-model.trim="v$.version.patch.$model"
                type="number"
                placeholder="patch"
                name="patch"
              >
            </div>
            <p class="form__group__suggestions">
              Suggestions:
              <a
                v-for="versionSuggestion in versionSuggestions"
                :key="versionSuggestion"
                class="link"
                @click.prevent="setVersionSuggestion(versionSuggestion)"
              >
                {{ versionSuggestion }}
              </a>
            </p>
          </div>

          <div
            class="form__group"
            :class="{ 'form__group--error': v$.version.published.$error }"
          >
            <label>
              <input
                id="abstractSchema"
                v-model.trim="v$.version.published.$model"
                name="published"
                type="checkbox"
              >
              Public version</label>
          </div>

          <div>
            <button
              class="btn btn-primary btn-rounded"
              :disabled="status.isPending()"
              data-cy="save"
              @click.prevent="release"
            >
              Release
            </button>
          </div>
        </form>
      </template>
    </page>
  </div>
</template>
<script lang="ts">
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import _ from 'lodash'
import semverInc from 'semver/functions/inc'
import api from '../../api'
import Breadcrumbs from '../../components/Breadcrumbs/index.vue'
import Page from '../../components/Page/index.vue'
import StatusFlash from '../../components/StatusFlash/index.vue'
import Status from '../../utils/Status'

export default {
  name: 'SchemaRelease',
  components: {
    Breadcrumbs,
    Page,
    StatusFlash,
  },
  setup() {
    return { v$: useVuelidate() }
  },

  data() {
    return {
      errors: [],
      version: {
        major: null,
        minor: null,
        patch: null,
        description: null,
        published: false,
      },
      status: new Status(),
      submitStatus: new Status(),
      breadcrumbs: [{
        label: 'Schemas',
        to: '/schemas',
      }],
      schema: null,
    }
  },

  computed: {
    isEdit() {
      return !!this.$route.params.uuid
    },
  },

  validations() {
    return {
      version: {
        major: { required },
        minor: { required },
        patch: { required },
        description: { required },
        published: {},
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
        const schema = await api.metadataSchemas.getDraft(this.$route.params.uuid)
        this.schema = schema.data
        this.versionSuggestions = this.getVersionSuggestions(this.schema.lastVersion || '0.0.0')
        this.breadcrumbs.push({
          label: this.schema.name,
          to: `/schemas/${this.schema.uuid}`,
        })
        this.version.description = this.schema.description
        this.status.setDone()
      } catch (error) {
        this.status.setError('Unable to get schema')
      }
    },

    async release() {
      this.v$.version.$touch()

      if (!this.v$.version.$invalid) {
        this.submitStatus.setPending()
        this.errors = []
        try {
          const versionData = this.formDataToRequestData(this.version)
          await api.metadataSchemas.postVersion(this.schema, versionData)
          await this.$router.push('/schemas')
        } catch (error) {
          const errors = _.get(error, 'response.data.errors')
          if (errors) {
            this.submitStatus.setError('Unable to publish a version')
            this.errors = errors
          } else {
            this.submitStatus.setErrorFromResponse(error, 'Version could not be published.')
          }
          window.scrollTo(0, 0)
        }
      }
    },

    formDataToRequestData(formData) {
      return {
        ...formData,
        version: `${formData.major}.${formData.minor}.${formData.patch}`,
      }
    },

    getVersionSuggestions(currentVersion) {
      return [
        semverInc(currentVersion, 'major'),
        semverInc(currentVersion, 'minor'),
        semverInc(currentVersion, 'patch'),
      ]
    },

    setVersionSuggestion(version) {
      const [major, minor, patch] = version.split('.')
      this.version.major = major
      this.version.minor = minor
      this.version.patch = patch
    },
  },
}
</script>
