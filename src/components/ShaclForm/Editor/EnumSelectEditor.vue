<template>
  <select
    class="input-field"
    :value="toInputValue(value)"
    @input="onInput"
    :key="resolvedCounter"
  >
    <option :value="null">
      - select -
    </option>
    <option
      v-for="key in keys"
      :key="key"
      :value="key"
    >
      {{ values[key] }}
    </option>
  </select>
</template>
<script lang="ts">
import * as $rdf from 'rdflib'
import _ from 'lodash'
import { Component, Prop, Vue } from 'vue-property-decorator'
import rdfUtils from '@/rdf/utils'
import api from '@/api'
import { SHACL } from '@/rdf/namespaces'

@Component({})
export default class EnumSelectEditor extends Vue {
  @Prop({ required: true })
  readonly field: any

  @Prop({ required: true })
  readonly value: any

  keys : any

  values : any

  resolvedCounter : number = 0

  created(): void {
    this.keys = []
    this.values = {}

    _.get(this.field, 'in', []).forEach((key) => {
      this.keys.push(key)
      this.values[key] = rdfUtils.pathTerm(key)

      if (this.field.nodeKind === SHACL('IRI').value) {
        this.resolveValue(key)
      }
    })
  }

  async resolveValue(key: string): Promise<void> {
    try {
      const label = await api.label.getLabel(key)
      this.values[key] = label.data.label
      this.resolvedCounter += 1
    } catch {
      // nothing could be fetched, keep default label
    }
  }

  onInput(e) {
    this.$emit('input', this.fromInputValue(e.target.value))
  }

  toInputValue(value) {
    return _.get(value, 'value', value)
  }

  fromInputValue(value) {
    try {
      return $rdf.namedNode(value)
    } catch {
      return value
    }
  }
}
</script>
