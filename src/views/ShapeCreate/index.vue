<template>
  <div>
    <breadcrumbs
      :links="breadcrumbs"
      current="Create shape"
    />
    <page
      title="Create shape"
      content-only
      small
    >
      <template #content>
        <form
          class="form"
          @submit.prevent="submit"
        >
          <status-flash
            :status="status"
            no-loading
          />
          <ul class="nav nav-tabs mb-4">
            <li class="nav-item">
              <a
                class="nav-link"
                :class="{'active': !preview }"
                @click.prevent="showPreview(false)"
              >
                Configuration
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                :class="{'active': preview }"
                @click.prevent="showPreview(true)"
              >
                Preview
              </a>
            </li>
          </ul>
          <div v-if="!preview">
            <div
              class="form__group"
              :class="{'form__group--error': $v.shape.name.$error}"
            >
              <label for="shape-name">Name</label>
              <input
                id="shape-name"
                v-model.trim="$v.shape.name.$model"
                placeholder="Name"
                name="name"
              >
              <p
                v-if="!$v.shape.name.required"
                class="invalid-feedback"
              >
                Field is required
              </p>
            </div>
            <div
              class="form__group"
              :class="{'form__group--error': $v.shape.definition.$error}"
            >
              <label>Definition</label>
              <prism-editor
                id="shape-definition"
                v-model="$v.shape.definition.$model"
                language="turtle"
              />
              <p
                v-if="!$v.shape.definition.required"
                class="invalid-feedback"
              >
                Field is required
              </p>
            </div>
            <div
              class="form__group"
              :class="{'form__group--error': $v.shape.published.$error}"
            >
              <label>
                <input
                  id="shape-published"
                  v-model.trim="$v.shape.published.$model"
                  name="shape-published"
                  type="checkbox"
                >
                Published</label>
              <p
                v-if="!$v.shape.definition.required"
                class="invalid-feedback"
              >
                Field is required
              </p>
            </div>
          </div>
          <div
            v-else
            class="mb-5"
          >
            <form-renderer
              v-if="!previewError"
              v-model="data"
              :definition="form"
              :validation-report="null"
            />
            <div
              v-else
              class="status-flash__alert status-flash__alert--danger mb-4"
            >
              Error while parsing the form definition:
              <br>
              {{ previewError }}
            </div>
          </div>
          <div>
            <button
              class="btn btn-primary btn-rounded"
              :disabled="status.isPending()"
              data-cy="create-shape"
            >
              Create shape
            </button>
          </div>
        </form>
      </template>
    </page>
  </div>
</template>
<script lang="ts">
import { required } from 'vuelidate/lib/validators'
import PrismEditor from 'vue-prism-editor'
import { SHACLFormParser } from '@/components/ShaclForm/Parser/SHACLFormParser'
import FormRenderer from '@/components/ShaclForm/FormRenderer.vue'
import api from '../../api'
import Breadcrumbs from '../../components/Breadcrumbs/index.vue'
import Page from '../../components/Page/index.vue'
import StatusFlash from '../../components/StatusFlash/index.vue'
import Status from '../../utils/Status'

export default {
  name: 'ShapeCreate',
  components: {
    Breadcrumbs,
    FormRenderer,
    Page,
    PrismEditor,
    StatusFlash,
  },

  validations() {
    return {
      shape: {
        name: { required },
        definition: { required },
        published: { required },
      },
    }
  },

  data() {
    return {
      shape: {
        name: null,
        definition: null,
        published: false,
      },
      status: new Status(),
      breadcrumbs: [{
        label: 'Shapes',
        to: '/shapes',
      }],
      preview: false,
      form: null,
      previewError: null,
      data: { subject: null, data: {} },
    }
  },

  methods: {
    async submit() {
      this.$v.shape.$touch()

      if (!this.$v.shape.$invalid) {
        this.status.setPending()
        try {
          await api.shapes.postShape(this.shape)
          await this.$router.replace('/shapes')
        } catch (error) {
          this.status.setErrorFromResponse(error, 'Shape could not be created.')
        }
      }
    },

    showPreview(preview) {
      if (preview) {
        try {
          this.previewError = null
          this.data = { subject: null, data: {} }

          const parser = new SHACLFormParser(this.shape.definition)
          this.form = parser.parseAll()
        } catch (error) {
          this.previewError = error
        }
      }
      this.preview = preview
    },
  },
}
</script>
