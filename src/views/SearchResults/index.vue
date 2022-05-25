<template>
  <div>
    <page :content-only="true">
      <template #content>
        <status-flash :status="status" />
        <template v-if="results">
          <h2>Search</h2>
          <div class="mb-2">
            <div v-if="isSparql">
              <div class="sparql">
                <pre>{{ sparqlParts.prefixes }}</pre>
                <textarea
                  v-model="sparqlQuery.prefixes"
                  class="w-100"
                  :rows="textareaRows(sparqlQuery.prefixes)"
                />
                <pre>{{ sparqlParts.selectStart }}</pre>
                <textarea
                  v-model="sparqlQuery.graphPattern"
                  class="graph-patterns"
                  :rows="textareaRows(sparqlQuery.graphPattern)"
                />
                <pre>{{ sparqlParts.selectEnd }}</pre>
                <textarea
                  v-model="sparqlQuery.ordering"
                  class="w-100"
                  :rows="textareaRows(sparqlQuery.ordering)"
                />
              </div>

              <button
                class="btn btn-primary"
                @click.prevent="searchSparql()"
              >
                Search
              </button>
            </div>
            <form
              v-else
              class="form--search"
            >
              <input
                v-model="query"
                type="text"
                placeholder="Search FAIR Data Point..."
                class="form-control mr-2 mb-2"
              >

              <b-dropdown
                v-for="filter in filterData"
                :key="filter.predicate"
                :variant="isFilterActive(filter) ? 'secondary' : 'outline-secondary'"
                class="mr-2 mb-2"
              >
                <template #button-content>
                  {{ filterLabel(filter) }}
                  <span
                    v-if="filterLabelBadgeValue(filter) > 0"
                    class="badge badge-pill badge-dark"
                  >
                    +{{ filterLabelBadgeValue(filter) }}
                  </span>
                </template>

                <b-dropdown-item
                  v-for="(filterValue, index) in filter.values"
                  :key="`${filter.predicate}-${index}`"
                  @click.prevent="toggleFilterValue(filter.predicate, filterValue.value)"
                >
                  <fa
                    v-if="filterValue.isChecked"
                    :icon="['far', 'check-square']"
                  />
                  <fa
                    v-else
                    :icon="['far', 'square']"
                  />
                  {{ valueLabel(filterValue) }}
                </b-dropdown-item>
                <b-dropdown-divider />
                <b-dropdown-item
                  @click.prevent="clearFilterValue(filter.predicate)"
                >
                  Clear selection
                </b-dropdown-item>
              </b-dropdown>

              <button
                class="btn btn-primary mr-2 mb-2"
                @click.prevent="searchSimple()"
              >
                Search
              </button>

              <a
                class="link mb-2"
                @click.prevent="switchToSparql()"
              >
                Switch to SPARQL
              </a>
            </form>
          </div>
          <hr>
          <div class="item-list">
            <div
              v-if="results.length === 0"
              class="item-list__empty"
            >
              Nothing was found.
            </div>
            <div
              v-for="item in results"
              :key="item.uri"
              class="item"
            >
              <a
                :href="item.uri"
                target="_blank"
                class="item__title"
              >
                {{ item.title }}
              </a>
              <p
                v-if="item.description"
                class="item__description"
              >
                {{ item.description | truncate }}
              </p>
              <div
                v-if="item.types"
                class="item__tags"
              >
                <a
                  v-for="(type, index) in item.types"
                  :key="index"
                  :href="type"
                  class="item__tags__tag"
                  target="_blank"
                >
                  {{ pathTerm(type) }}
                </a>
              </div>
            </div>
          </div>
        </template>
      </template>
    </page>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import axios from 'axios'
import api from '@/api'
import rdfUtils from '@/rdf/utils'
import Page from '@/components/Page/index.vue'
import Status from '@/utils/Status'
import StatusFlash from '@/components/StatusFlash/index.vue'

@Component({ components: { Page, StatusFlash } })
export default class SearchResults extends Vue {
  query: string = null

  sparqlParts: any = null

  status: Status = new Status()

  results: any = null

  isSparql: boolean = false

  filterData: any = []

  sparqlTemplate: any = null

  sparqlQuery: any = null

  // Simple search

  get queryGraphPatterns() {
    return `?entity ?relationPredicate ?relationObject .\nFILTER isLiteral(?relationObject)\nFILTER CONTAINS(LCASE(str(?relationObject)), LCASE("${this.query}"))`
  }

  pathTerm(term): string {
    return rdfUtils.pathTerm(term)
  }

  isFilterActive(filter): boolean {
    return filter.values.some((value) => value.isChecked)
  }

  filterLabel(filter): string {
    if (this.isFilterActive(filter)) {
      const firstChecked = filter.values.find((value) => value.isChecked)
      return `${filter.label}: ${this.valueLabel(firstChecked)}`
    }

    return filter.label
  }

  filterLabelBadgeValue(filter): number {
    return filter.values.filter((value) => value.isChecked).length - 1
  }

  valueLabel(value): string {
    return value.label || this.pathTerm(value.value)
  }

  switchToSparql() {
    this.sparqlQuery = this.createSparqlQuery()
    this.isSparql = true
  }

  mapFilterValueIsChecked(filterData, mapIsChecked) {
    return filterData.map((filter) => ({
      ...filter,
      values: filter.values.map((value) => ({
        ...value,
        isChecked: mapIsChecked(value.value, value.isChecked, filter),
      })),
    }))
  }

  toggleFilterValue(predicate, value) {
    const toggleIsChecked = (v, isChecked) => (v === value ? !isChecked : isChecked)
    this.filterData = this.mapFilterValueIsChecked(this.filterData, toggleIsChecked)
  }

  clearFilterValue(predicate) {
    const toggleIsChecked = (v, isChecked, f) => (f.predicate === predicate ? false : isChecked)
    this.filterData = this.mapFilterValueIsChecked(this.filterData, toggleIsChecked)
  }

  createSparqlQuery() {
    const sparqlQuery = {
      prefixes: '',
      graphPattern: this.query.length > 0 ? `${this.queryGraphPatterns}` : '',
      ordering: 'ASC(?title)',
    }

    let i = 1
    const filters = this.filterData.reduce((acc, filter) => {
      const filterValues = filter.values
        .filter((value) => value.isChecked)
        .map((value) => value.value)

      if (filterValues.length > 0) {
        const values = (filter.type === 'LITERAL'
          ? filterValues.map((v) => `"${v}"`)
          : filterValues.map((v) => `<${v}>`)
        ).join(', ')

        let f = `\n\n# Filter ${filter.label}\n`
        f += `?entity <${filter.predicate}> ?o${i} .\n`
        f += `FILTER (?o${i} IN ( ${values} ))`
        i += 1
        return acc + f
      }
      return acc
    }, '')

    sparqlQuery.graphPattern += filters

    return sparqlQuery
  }

  // SPARQL search

  textareaRows(content) {
    return Math.max(2, content.split('\n').length)
  }

  // Component

  created(): void {
    this.init()
  }

  @Watch('$route')
  async init() {
    this.query = this.$route.query.q as string

    try {
      this.status.setPending()
      this.results = null
      const [search, query, filters] = await this.loadData()
      this.results = search.data
      this.sparqlTemplate = query.data.template

      const [prefixes, rest1] = this.sparqlTemplate.split('{{prefixes}}\n')
      const [selectStart, rest2] = rest1.split('{{graphPattern}}\n')
      const [selectEnd] = rest2.split('{{ordering}}\n')

      this.sparqlParts = {
        prefixes,
        selectStart,
        selectEnd,
      }

      this.filterData = this.mapFilterValueIsChecked(filters.data, () => false)
      this.status.setDone()
    } catch (error) {
      this.status.setError('Unable to get search results')
    }
  }

  async loadData() {
    return axios.all([
      api.search.search({ q: this.query }),
      api.search.getQuery(),
      api.search.getFilters(),
    ])
  }

  async searchSimple() {
    try {
      this.status.setPending()
      const search = await api.search.postQuery(this.createSparqlQuery())
      this.results = search.data
      this.status.setDone()
    } catch (error) {
      this.status.setError('Unable to get search results')
    }
  }

  async searchSparql() {
    try {
      this.status.setPending()
      const search = await api.search.postQuery(this.sparqlQuery)
      this.results = search.data
      this.status.setDone()
    } catch (error) {
      this.status.setError('Unable to get search results')
    }
  }
}
</script>
