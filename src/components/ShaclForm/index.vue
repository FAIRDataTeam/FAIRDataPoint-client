<template>
  <div>
    <status-flash :status="status" />
    <form
      v-if="!status.isError() && formDefinition"
      @submit.prevent="onSubmit"
    >
      <form-renderer
        v-if="formDefinition"
        ref="formRenderer"
        v-model="data"
        :subject="subject"
        :definition="formDefinition"
        :validation-report="validationReport"
        @update:modelValue="onInput"
      />
      <div class="mb-5">
        <a
          v-b-toggle.rdf-view
          class="text-primary collapse-link"
        >
          View RDF
          <fa
            :icon="['fas', 'angle-down']"
            class="rotate-icon"
          />
        </a>
        <b-collapse id="rdf-view">
          <prism-editor
            v-model="turtle"
            language="turtle"
            :readonly="true"
          />
        </b-collapse>
      </div>
      <button
        class="btn btn-primary btn-rounded"
        :disabled="submitStatus.isPending()"
        type="submit"
        data-cy="save"
      >
        <fa
          v-if="submitStatus.isPending()"
          :icon="['fas', 'spinner']"
          spin
        />
        Save
      </button>
    </form>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import _ from 'lodash'
import * as $rdf from 'rdflib'
import PrismEditor from '@/components/PrismEditor/index.vue'
import FormRenderer from '@/components/ShaclForm/FormRenderer.vue'
import StatusFlash from '@/components/StatusFlash/index.vue'
import Status from '@/utils/Status'
import { FormShape, SHACLFormParser } from '@/components/ShaclForm/Parser/SHACLFormParser'
import * as formData from '@/components/ShaclForm/formData'
import { ValidationReport } from '@/components/ShaclForm/Parser/ValidationReport'

export default defineComponent({
  components: {
    FormRenderer,
    PrismEditor,
    StatusFlash,
  },
  props: {
    shacl: { type: String, required: true },
    rdf: { type: Object as PropType<$rdf.IndexedFormula>, required: true },
    subject: { type: String, required: true },
    targetClasses: { type: Array as PropType<any[]>, required: true },
    validationReport: { type: Object as PropType<ValidationReport>, required: true },
    submitStatus: { type: Object as PropType<Status>, required: true },
    fillDefaults: { type: Boolean, default: false },
  },
  emits: ['submit'],
  data() {
    return {
      form: null as FormShape | null,
      data: {
        subject: '',
        data: {},
      },
      text: '',
      turtle: null,
      status: new Status(),
      formDefinition: null,
    }
  },
  created() {
    try {
      const parser = new SHACLFormParser(this.shacl)
      this.form = parser.parse(this.targetClasses)
      const groups = parser.parseAndGroup(this.targetClasses)

      this.formDefinition = {
        targetClasses: this.targetClasses,
        groups,
      }

      this.data = formData.fromRdf(
        this.form,
        $rdf.namedNode(this.subject),
        this.rdf,
        this.fillDefaults,
      )
      this.status.setDone()
    } catch (error) {
      this.status.setError('The form configuration is not valid.')
    }
  },
  methods: {
    onInput(value: any = null) {
      if (value) {
        this.data = value
      }
      this.turtle = formData.toRdf(this.rdf, this.data, this.subject, this.form)
    },
    onSubmit() {
      this.turtle = formData.toRdf(this.rdf, this.data, this.subject, this.form)
      _.get(this, '$refs.formRenderer.cleanDirty')()
      this.$emit('submit', this.turtle)
    },
  },
})
</script>
