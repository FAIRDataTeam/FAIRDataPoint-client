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
      <template v-slot:content>
        <form
          class="form"
          @submit.prevent="submit"
        >
          <status-flash
            :status="status"
            no-loading
          />
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
import api from '../../api'
import Breadcrumbs from '../../components/Breadcrumbs/index.vue'
import Page from '../../components/Page/index.vue'
import StatusFlash from '../../components/StatusFlash/index.vue'
import Status from '../../utils/Status'

export default {
  name: 'ShapeCreate',
  components: {
    Breadcrumbs,
    Page,
    PrismEditor,
    StatusFlash,
  },

  validations() {
    return {
      shape: {
        name: { required },
        definition: { required },
      },
    }
  },

  data() {
    return {
      shape: {
        name: null,
        definition: null,
      },
      status: new Status(),
      breadcrumbs: [{
        label: 'Shapes',
        to: '/shapes',
      }],
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
  },
}
</script>
