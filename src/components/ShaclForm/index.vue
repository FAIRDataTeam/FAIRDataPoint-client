<template>
  <div>
    <status-flash :status="status" />
    <form
      v-if="!status.isError() && form"
      @submit.prevent="onSubmit"
    >
      <form-renderer
        v-if="form"
        v-model="data"
        :subject="subject"
        :definition="form"
        :validation-report="validationReport"
        @input="onInput"
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
        type="submit"
        data-cy="save"
      >
        Save
      </button>
    </form>
  </div>
</template>
<script lang="ts">
import * as $rdf from 'rdflib'
import { Component, Prop, Vue } from 'vue-property-decorator'
import PrismEditor from 'vue-prism-editor'
import FormRenderer from '@/components/ShaclForm/FormRenderer.vue'
import StatusFlash from '@/components/StatusFlash/index.vue'
import Status from '@/utils/Status'
import { SHACLParser } from '@/components/ShaclForm/SHACLParser'
import * as formData from '@/components/ShaclForm/formData'
import { ValidationReport } from '@/components/ShaclForm/ValidationReport'


@Component({
  components: {
    FormRenderer,
    PrismEditor,
    StatusFlash,
  },
})
export default class ShaclForm extends Vue {
  @Prop({ required: true })
  readonly shacl: any

  @Prop({ required: true })
  readonly rdf: any

  @Prop({ required: true })
  readonly subject: string

  @Prop({ required: true })
  readonly shape: string

  @Prop({ required: true })
  readonly filter: any

  @Prop({ required: true })
  readonly validationReport: ValidationReport

  @Prop({ required: false, default: () => [] })
  readonly skippedFields: string[]

  form: any

  data: any = {
    subject: this.subject,
    data: {},
  }

  text: any = ''

  turtle: any = null

  status: Status = new Status()

  created() {
    try {
      const parser = new SHACLParser(this.shacl, this.filter)
      this.form = parser.parse(this.shape)
      this.data = formData.fromRdf(this.form, $rdf.namedNode(this.subject), this.rdf)
      this.status.setDone()
    } catch (error) {
      this.status.setError('The form configuration is not valid.')
    }
  }

  onInput() {
    this.turtle = formData.toRdf(this.rdf, this.data, this.subject, this.skippedFields)
  }

  onSubmit() {
    this.$emit('submit', this.turtle)
  }
}
</script>
