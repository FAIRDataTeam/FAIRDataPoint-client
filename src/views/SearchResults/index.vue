<template>
  <div>
    <page :content-only="true">
      <template #content>
        <template>
          <!-- Search header -->
          <div class="d-flex justify-content-between align-items-baseline">
            <h2>Search</h2>
            <div>
              <a
                v-if="isSparql && savedQueries.length > 0"
                class="link"
                @click.prevent="toggleSavedQueries()"
              >Saved queries</a>
            </div>
          </div>

          <div class="mb-2">
            <!-- Search SPARQL -->
            <div
              v-if="isSparql"
              class="row"
            >
              <!-- Saved query details -->
              <div :class="savedQueriesVisible ? 'col-9' : 'col-12'">
                <div
                  v-if="selectedSavedQuery"
                  class="alert-info selected-query"
                >
                  <p class="d-flex justify-content-between">
                    <strong>{{ selectedSavedQuery.name }}</strong>
                    <a
                      v-if="canDeleteSavedQuery(selectedSavedQuery)"
                      class="link text-danger"
                      @click.prevent="deleteQuery(selectedSavedQuery)"
                    >
                      <small>Delete</small>
                    </a>
                  </p>
                  <p>{{ selectedSavedQuery.description }}</p>
                  <p>
                    <small>
                      Created by:
                      {{ selectedSavedQuery.user.firstName }}
                      {{ selectedSavedQuery.user.lastName }}
                    </small>
                  </p>
                </div>

                <!-- SPARQL input -->
                <div class="sparql">
                  <pre>{{ sparqlParts.prefixes }}</pre>
                  <textarea
                    v-model="sparqlQuery.prefixes"
                    class="w-100"
                    :rows="textareaRows(sparqlQuery.prefixes)"
                    @input="clearSelectedSavedQuery"
                  />
                  <pre>{{ sparqlParts.selectStart }}</pre>
                  <textarea
                    v-model="sparqlQuery.graphPattern"
                    class="graph-patterns"
                    :rows="textareaRows(sparqlQuery.graphPattern)"
                    @input="clearSelectedSavedQuery"
                  />
                  <pre>{{ sparqlParts.selectEnd }}</pre>
                  <textarea
                    v-model="sparqlQuery.ordering"
                    class="w-100"
                    :rows="textareaRows(sparqlQuery.ordering)"
                    @input="clearSelectedSavedQuery"
                  />
                </div>

                <!-- SPARQL search controls -->
                <button
                  class="btn btn-primary"
                  @click.prevent="searchSparql()"
                >
                  Search
                </button>
                <button
                  v-if="canCreateSavedQuery()"
                  v-b-modal.save-query-modal
                  class="btn btn-link"
                  @click="initNewQuery"
                >
                  Save query
                </button>

                <!-- Save query modal -->
                <b-modal
                  id="save-query-modal"
                  title="Save query"
                  ok-title="Save"
                  :ok-disabled="!saveQueryValid()"
                  @ok="saveQuery"
                >
                  <div class="form__group">
                    <label for="query-name">Name</label>
                    <input
                      id="query-name"
                      v-model.trim="newQuery.name"
                      type="text"
                    >
                  </div>
                  <div class="form__group">
                    <label for="query-description">Description</label>
                    <textarea
                      id="query-description"
                      v-model.trim="newQuery.description"
                    />
                  </div>
                  <div class="form__group">
                    <label>Type</label>

                    <label class="mb-2">
                      <input
                        id="private"
                        v-model="newQuery.type"
                        type="radio"
                        value="PRIVATE"
                        class="mr-1"
                      >
                      Private.
                      <span class="font-weight-normal">Visible only to you.</span>
                    </label>
                    <label class="mb-2">
                      <input
                        id="internal"
                        v-model="newQuery.type"
                        type="radio"
                        value="INTERNAL"
                        class="mr-1"
                      >
                      Internal.
                      <span class="font-weight-normal">Visible only to logged-in users.</span>
                    </label>
                    <label>
                      <input
                        id="public"
                        v-model="newQuery.type"
                        type="radio"
                        value="PUBLIC"
                        class="mr-1"
                      >
                      Public.
                      <span class="font-weight-normal">Visible to everyone.</span>
                    </label>
                  </div>
                </b-modal>
              </div>

              <!-- Saved queries list -->
              <div
                v-if="savedQueriesVisible"
                class="col-3"
              >
                <div class="card">
                  <div class="card-header">
                    <strong>Saved queries</strong>
                  </div>
                  <div class="card-body card-body-saved-queries">
                    <ul class="saved-queries-list">
                      <li
                        v-for="query in savedQueries"
                        :key="query.uuid"
                        @click="openSavedQuery(query.uuid)"
                      >
                        {{ query.name }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <!-- Search simple -->
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
                @click.prevent="searchWithFilters()"
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

          <!-- Search results -->
          <status-flash :status="status" />
          <div class="item-list" v-if="results">
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

  status: Status = new Status()

  results: any = null

  // SPARQL search

  isSparql: boolean = false

  sparqlParts: any = null

  sparqlTemplate: any = null

  sparqlQuery: any = null

  // Simple search

  filterData: any = []

  // Saved queries

  savedQueries: any = []

  savedQueriesVisible: boolean = false

  selectedSavedQuery: any = null

  newQuery = {
    name: '',
    description: '',
    type: '',
  }

  // Navigation

  createUrl(query, isSparql, savedQueryUuid = null, filterData = null) {
    const url = []

    if (query) {
      url.push(`q=${this.query}`)
    }

    if (isSparql) {
      url.push('isSparql=true')
    }

    if (savedQueryUuid) {
      url.push(`savedQuery=${savedQueryUuid}`)
    }

    if (filterData) {
      const filterValues = filterData.reduce((acc, filter) => {
        const checkedValues = filter.values.filter((v) => v.isChecked)
        if (checkedValues.length > 0) {
          const value = checkedValues.map((v) => encodeURIComponent(v.value)).join(',')
          acc.push(`${encodeURIComponent(filter.predicate)}=${value}`)
        }
        return acc
      }, [])
      url.push(...filterValues)
    }

    return `?${url.join('&')}`
  }

  openSavedQuery(savedQueryUuid) {
    this.$router.push(this.createUrl(null, true, savedQueryUuid)).catch(() => {
    })
  }

  searchWithFilters() {
    this.$router.push(this.createUrl(this.query, false, null, this.filterData))
  }

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
    this.isSparql = true
    this.$router.push(this.createUrl(this.query, true, null, this.filterData))
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
      graphPattern: this.query && this.query.length > 0 ? `${this.queryGraphPatterns}` : '',
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
    this.isSparql = this.$route.query.isSparql === 'true'

    try {
      this.status.setPending()
      this.results = null
      const [query, filters, savedQueries] = await this.loadData()
      this.sparqlTemplate = query.data.template
      this.savedQueries = savedQueries.data

      const [prefixes, rest1] = this.sparqlTemplate.split('{{prefixes}}\n')
      const [selectStart, rest2] = rest1.split('{{graphPattern}}\n')
      const [selectEnd] = rest2.split('{{ordering}}\n')

      this.sparqlParts = {
        prefixes,
        selectStart,
        selectEnd,
      }

      this.initializeFilterData(filters.data)

      let search

      if (this.isSparql) {
        this.selectedSavedQuery = null
        this.sparqlQuery = this.createSparqlQuery()
        this.isSparql = true

        const savedQueryUuid = this.$route.query.savedQuery
        const savedQuery = this.savedQueries.find((q) => q.uuid === savedQueryUuid)
        if (savedQuery) {
          this.setQuery(savedQuery)
        }

        search = this.searchSparql
      } else {
        search = this.searchSimple
      }

      if (this.query) {
        await search()
      } else {
        this.status.setDone()
      }
    } catch (error) {
      this.status.setError('Unable to get search results')
    }
  }

  async loadData() {
    return axios.all([
      api.search.getQuery(),
      api.search.getFilters(),
      api.search.getSavedQueries(),
    ])
  }

  initializeFilterData(filterData) {
    const checkedValues = filterData.reduce((acc, filter) => {
      const queryValues = this.$route.query[filter.predicate]
      const values = queryValues ? `${queryValues}`.split(',') : []
      acc[filter.predicate] = values.reduce((a, v) => ({ ...a, [v]: true }), {})
      return acc
    }, {})
    const mapIsChecked = (value, isChecked, filter) => checkedValues[filter.predicate][value]
    this.filterData = this.mapFilterValueIsChecked(filterData, mapIsChecked)
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

  // Saved queries

  canCreateSavedQuery() {
    return this.$store.getters['auth/authenticated']
  }

  canDeleteSavedQuery(query) {
    const user = this.$store.getters['auth/user']
    return user?.uuid === query.uuid || user?.role === 'ADMIN'
  }

  toggleSavedQueries() {
    this.savedQueriesVisible = !this.savedQueriesVisible
  }

  initNewQuery() {
    this.newQuery = {
      name: '',
      description: '',
      type: 'PRIVATE',
    }
  }

  setQuery(query) {
    this.selectedSavedQuery = query
    this.sparqlQuery.prefixes = query.variables.prefixes
    this.sparqlQuery.graphPattern = query.variables.graphPattern
    this.sparqlQuery.ordering = query.variables.ordering
  }

  saveQueryValid() {
    return this.newQuery.name.length > 0
  }

  async saveQuery() {
    const data = {
      ...this.newQuery,
      variables: this.sparqlQuery,
    }

    try {
      const savedQuery = await api.search.postSavedQuery(data)
      this.savedQueries.push(savedQuery.data)
    } catch (error) {
      this.status.setError('Unable to save the search query')
    }
  }

  clearSelectedSavedQuery() {
    this.selectedSavedQuery = null
  }

  async deleteQuery(query) {
    if (window.confirm(`Are you sure you want to delete ${query.name}?`)) {
      try {
        await api.search.deleteSavedQuery(query.uuid)
        this.savedQueries = this.savedQueries.filter((q) => q.uuid !== query.uuid)
        this.selectedSavedQuery = null
      } catch (error) {
        this.status.setError('Unable to delete the search query')
      }
    }
  }
}
</script>
