<template>
  <div class="autocomplete-wrapper">
    <div
      v-if="value"
      class="autocomplete-value"
    >
      {{ label }} <span class="uri">{{ value }}</span>
      <a
        class="clear"
        @click="clearValue()"
      >
        <fa :icon="['fas', 'times']" />
      </a>
    </div>
    <div v-else>
      <input
        v-model="searchValue"
        class="input-field"
        placeholder="Typing to search"
        :name="name"
        @focus="onSearchInput"
        @input="onSearchInput"
        @blur="hideOptions"
      >
      <ul
        v-if="options && options.length > 0"
        class="autocomplete-options"
      >
        <li
          v-for="option in options"
          :key="option.uri"
          @click="selectValue(option.uri, option.label)"
        >
          {{ option.label }} <span class="uri">&lt;{{ option.uri }}&gt;</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts">
import * as $rdf from 'rdflib'
import {
  Component, Prop, Vue, Watch,
} from 'vue-property-decorator'
import fieldUtils from '@/components/ShaclForm/fieldUtils'
import rdfUtils from '@/rdf/utils'
import api from '@/api'
import { debounce } from 'vue-debounce'
import _ from 'lodash'

@Component
export default class TextFieldEditor extends Vue {
  @Prop({ required: true })
  readonly field: any

  @Prop({ required: true })
  readonly value: any

  label: string = ''

  searchValue: string = ''

  options: any = null

  debounceGetOptions: any

  get name() {
    return rdfUtils.pathTerm(this.field.path)
  }

  created(): void {
    this.init()
  }

  @Watch('$route')
  init() {
    this.debounceGetOptions = debounce((val) => {
      this.getOptions(val)
    }, '300ms')

    if (this.value) {
      this.label = this.getDefaultLabel()
      this.resolveLabel()
    }
  }

  getDefaultLabel() {
    const value = `${_.get(this.value, 'value', this.value)}`
    return rdfUtils.pathTerm(value)
  }

  async resolveLabel() {
    try {
      const result = await api.label.getLabel(this.value)
      this.label = result.data.label
    } catch {
      // nothing could be fetched, keep default label
    }
  }

  selectValue(value, label) {
    this.$emit('input', this.wrapValue(value))

    this.label = label
    this.searchValue = ''
    this.options = []
  }

  clearValue() {
    this.$emit('input', null)
  }

  onSearchInput(e) {
    this.debounceGetOptions(e.target.value)
  }

  async getOptions(query) {
    const result = await api.forms.postAutoComplete(this.field.class, query)
    this.options = result.data
  }

  hideOptions() {
    setTimeout(() => {
      this.options = []
    }, 100)
  }

  wrapValue(value) {
    try {
      return $rdf.namedNode(value)
    } catch {
      return value
    }
  }
}
</script>
