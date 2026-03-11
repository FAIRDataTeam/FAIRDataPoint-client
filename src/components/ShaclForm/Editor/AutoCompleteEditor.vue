<template>
  <div class="autocomplete-wrapper">
    <div
      v-if="modelValue"
      class="autocomplete-value"
    >
      {{ label }} <span class="uri">{{ modelValue }}</span>
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
import { defineComponent } from 'vue'
import * as $rdf from 'rdflib'
import _ from 'lodash'
import rdfUtils from '@/rdf/utils'
import api from '@/api'

export default defineComponent({
  props: {
    field: { type: Object, required: true },
    modelValue: { type: [Object, String], required: true },
  },
  emits: ['update:modelValue'],
  data() {
    return {
      label: '' as string,
      searchValue: '' as string,
      options: null as any,
      debounceGetOptions: null as any,
    }
  },
  computed: {
    name() {
      return rdfUtils.pathTerm(this.field.path)
    },
  },
  watch: {
    $route: 'init',
  },
  created(): void {
    this.init()
  },
  methods: {
    init() {
      this.debounceGetOptions = _.debounce((val) => {
        this.getOptions(val)
      }, 300)

      if (this.modelValue) {
        this.label = this.getDefaultLabel()
        this.resolveLabel()
      }
    },
    getDefaultLabel() {
      const value = `${_.get(this.modelValue, 'value', this.modelValue)}`
      return rdfUtils.pathTerm(value)
    },
    async resolveLabel() {
      try {
        const result = await api.label.getLabel(this.modelValue)
        this.label = result.data.label
      } catch {
        // nothing could be fetched, keep default label
      }
    },
    selectValue(value, label) {
      this.$emit('update:modelValue', this.wrapValue(value))

      this.label = label
      this.searchValue = ''
      this.options = []
    },
    clearValue() {
      this.$emit('update:modelValue', null)
    },
    onSearchInput(e) {
      this.debounceGetOptions(e.target.value)
    },
    async getOptions(query) {
      const result = await api.forms.postAutoComplete(this.field.class, query)
      this.options = result.data
    },
    hideOptions() {
      setTimeout(() => {
        this.options = []
      }, 100)
    },
    wrapValue(value) {
      try {
        return $rdf.namedNode(value)
      } catch {
        return value
      }
    },
  },
})
</script>
