<template>
  <div>
    <breadcrumbs
      v-if="shape"
      :links="breadcrumbs"
      :current="title"
    />
    <page
      :title="title"
      content-only
      small
    >
      <template v-slot:content>
        <status-flash :status="status" />
        <status-flash
          :status="submitStatus"
          no-loading
        />
        <form
          class="form"
          @submit.prevent="submit"
        >
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
            v-if="!internal"
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
          <div
            v-if="internal"
            class="status-flash__alert status-flash__alert--danger mb-4"
          >
            You are editing an internal shape. This action might break the FDP.
            <br>
            Make sure you know what you are doing before saving.
          </div>
          <div>
            <button
              class="btn btn-primary btn-rounded"
              :disabled="status.isPending()"
              data-cy="create-shape"
            >
              Save shape
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
import api from '../../api'
import Breadcrumbs from '../../components/Breadcrumbs/index.vue'
import Page from '../../components/Page/index.vue'
import Status from '../../utils/Status'
import StatusFlash from '../../components/StatusFlash/index.vue'

export default {
  name: 'ShaclDetail',
  components: {
    Breadcrumbs,
    StatusFlash,
    Page,
    PrismEditor,
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
      title: null,
      shape: null,
      internal: false,
      shapeForm: {
        name: null,
        definition: null,
        published: false,
      },
      status: new Status(),
      submitStatus: new Status(),
      breadcrumbs: [{
        label: 'Shapes',
        to: '/shapes',
      }],
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

        const response = await api.shapes.getShape(this.$route.params.id)
        this.shape = response.data
        this.internal = this.shape.type === 'INTERNAL'
        this.setTitle()
        this.status.setDone()
      } catch (error) {
        this.status.setError('Unable to get shape.')
      }
    },

    async submit() {
      this.$v.shape.$touch()

      if (!this.$v.shape.$invalid) {
        try {
          this.submitStatus.setPending()
          await api.shapes.putShape(this.shape)
          this.setTitle()
          this.submitStatus.setDone('Shape was successfully updated!')
        } catch (error) {
          this.submitStatus.setErrorFromResponse(error, 'Shape could not be updated.')
        }
      }
    },

    setTitle() {
      this.title = this.shape.name
    },
  },
}
</script>
