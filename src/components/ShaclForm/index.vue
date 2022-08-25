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
import _ from 'lodash'
import * as $rdf from 'rdflib'
import { Component, Prop, Vue } from 'vue-property-decorator'
import PrismEditor from 'vue-prism-editor'
import FormRenderer from '@/components/ShaclForm/FormRenderer.vue'
import StatusFlash from '@/components/StatusFlash/index.vue'
import Status from '@/utils/Status'
import { FormShape, SHACLFormParser } from '@/components/ShaclForm/Parser/SHACLFormParser'
import * as formData from '@/components/ShaclForm/formData'
import { ValidationReport } from '@/components/ShaclForm/Parser/ValidationReport'

@Component({
  components: {
    FormRenderer,
    PrismEditor,
    StatusFlash,
  },
})
export default class ShaclForm extends Vue {
  @Prop({ required: true })
  readonly shacl: string

  @Prop({ required: true })
  readonly rdf: $rdf.IndexedFormula

  @Prop({ required: true })
  readonly subject: string

  @Prop({ required: true })
  readonly targetClasses: $rdf.ValueType[]

  @Prop({ required: true })
  readonly validationReport: ValidationReport

  @Prop({ required: true })
  readonly submitStatus: Status

  @Prop({ required: false, default: false })
  readonly fillDefaults: boolean

  form: FormShape

  data: any = {
    subject: '',
    data: {},
  }

  text: any = ''

  turtle: any = null

  status: Status = new Status()

  formDefinition : any = null

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
  }

  onInput() {
    this.turtle = formData.toRdf(this.rdf, this.data, this.subject, this.form)
  }

  onSubmit() {
    _.get(this, '$refs.formRenderer.cleanDirty')()
    this.$emit('submit', this.turtle)
  }
}
</script>
