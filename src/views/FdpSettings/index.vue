<template>
  <div>
    <page
      title="Settings"
      content-only
      small
    >
      <template #content>
        <status-flash :status="status" />
        <div v-if="settings">
          <form
            class="form"
            @submit.prevent="submitSettings"
          >
            <status-flash :status="submitStatus" />

            <h2>FDP Client</h2>

            <div class="form__group">
              <label for="clientUrl">Client URL</label>
              <input
                id="clientUrl"
                :value="settingsData.clientUrl"
                disabled
              >
            </div>

            <div class="form__group">
              <label for="appTitle">App Title</label>
              <input
                id="appTitle"
                v-model="$v.settings.appTitle.$model"
              >
            </div>

            <div class="form__group">
              <label for="appSubtitle">App Subtitle</label>
              <input
                id="appSubtitle"
                v-model="$v.settings.appSubtitle.$model"
              >
            </div>

            <h2>Metadata</h2>

            <div class="form__group">
              <label>Metadata Metrics</label>
              <ul>
                <li
                  v-for="(v, index) in $v.settings.metadataMetrics.$each.$iter"
                  :key="`metric-${index}`"
                >
                  <div class="d-flex align-items-start">
                    <div class="flex-grow-1">
                      <div
                        class="form__group"
                        :class="{'form__group--error': v.metricUri.$error}"
                      >
                        <label
                          :for="`metric.${index}.metricUri`"
                        >
                          Metric URI
                        </label>
                        <input
                          v-model.trim="v.metricUri.$model"
                          :name="`metric.${index}.metricUri`"
                        >
                        <p
                          v-if="!v.metricUri.required"
                          class="invalid-feedback"
                        >
                          Field is required
                        </p>
                        <p
                          v-if="!v.metricUri.url"
                          class="invalid-feedback"
                        >
                          Field should be a valid URI
                        </p>
                      </div>
                      <div
                        class="form__group"
                        :class="{'form__group--error': v.resourceUri.$error}"
                      >
                        <label
                          :for="`metric.${index}.resourceUri`"
                        >
                          Resource URI
                        </label>
                        <input
                          v-model.trim="v.resourceUri.$model"
                          :name="`metric.${index}.resourceUri`"
                        >
                        <p
                          v-if="!v.resourceUri.required"
                          class="invalid-feedback"
                        >
                          Field is required
                        </p>
                        <p
                          v-if="!v.resourceUri.url"
                          class="invalid-feedback"
                        >
                          Field should be a valid URI
                        </p>
                      </div>
                    </div>
                    <a
                      class="text-danger ml-3 p-1"
                      @click.prevent="removeMetadataMetric(index)"
                    >
                      <fa :icon="['fas', 'times']" />
                    </a>
                  </div>
                </li>
              </ul>

              <button
                class="btn btn-link"
                @click.prevent="addMetadataMetric()"
              >
                <fa :icon="['fas', 'plus']" />
                Add
              </button>
            </div>

            <h2>FDP Index connection</h2>

            <div class="form__group">
              <label for="users">
                <input
                  id="users"
                  v-model="$v.settings.ping.enabled"
                  type="checkbox"
                > Enabled
              </label>
            </div>
            <div
              v-if="endpointsFromConfigVisible()"
              class="form__group"
            >
              <label>From config file (application.yml)</label>
              <ul>
                <li
                  v-for="(e, index) in settings.ping.endpointsFromConfig"
                  :key="`endpoint-from-config-${index}`"
                >
                  <div class="form__group">
                    <input
                      :value="e"
                      disabled
                    >
                  </div>
                </li>
              </ul>
            </div>

            <div class="form__group">
              <label>Connected FDP Indexes</label>
              <ul>
                <li
                  v-for="(v, index) in $v.settings.ping.endpoints.$each.$iter"
                  :key="`endpoint-${index}`"
                >
                  <div class="d-flex align-items-start">
                    <div class="flex-grow-1">
                      <div
                        class="form__group"
                        :class="{'form__group--error': v.endpoint.$error}"
                      >
                        <input
                          v-model.trim="v.endpoint.$model"
                        >
                        <p
                          v-if="!v.endpoint.required"
                          class="invalid-feedback"
                        >
                          Field is required
                        </p>
                        <p
                          v-if="!v.endpoint.url"
                          class="invalid-feedback"
                        >
                          Field should be a valid URI
                        </p>
                      </div>
                    </div>
                    <a
                      class="text-danger ml-3 p-1"
                      @click.prevent="removePingEndpoint(index)"
                    >
                      <fa :icon="['fas', 'times']" />
                    </a>
                  </div>
                </li>
              </ul>

              <button
                class="btn btn-link"
                @click.prevent="addPingEndpoint()"
              >
                <fa :icon="['fas', 'plus']" />
                Add
              </button>
            </div>

            <div class="form__group">
              <label for="pingInterval">Interval</label>
              <input
                id="pingInterval"
                :value="settingsData.ping.interval"
                disabled
              >
            </div>

            <h2>Metadata storage</h2>

            <div class="form__group">
              <label for="repository">Connected triple store (main)</label>
              <input
                id="repository"
                :value="settingsData.mainRepository.type"
                disabled
              >
            </div>

            <div class="form__group">
              <label for="repository">Connected triple store (drafts)</label>
              <input
                id="repository"
                :value="settingsData.draftsRepository.type"
                disabled
              >
            </div>

            <h2>Forms</h2>

            <h3>Autocomplete</h3>

            <div class="form__group">
              <label for="searchNamespace">
                <input
                  id="searchNamespace"
                  v-model="$v.settings.forms.autocomplete.searchNamespace.$model"
                  type="checkbox"
                > Search namespace
              </label>
            </div>

            <div class="form__group">
              <label>Sources</label>

              <ul>
                <li
                  v-for="(v, index) in $v.settings.forms.autocomplete.sources.$each.$iter"
                  :key="`source-${index}`"
                >
                  <div class="d-flex align-items-start">
                    <div class="flex-grow-1">
                      <div
                        class="form__group"
                        :class="{'form__group--error': v.rdfType.$error}"
                      >
                        <label :for="`source.${index}.rdfType`">RDF Type</label>
                        <input
                          v-model.trim="v.rdfType.$model"
                          :name="`source.${index}.rdfType`"
                        >
                        <p
                          v-if="!v.rdfType.required"
                          class="invalid-feedback"
                        >
                          Field is required
                        </p>
                      </div>
                      <div
                        class="form__group"
                        :class="{'form__group--error': v.sparqlEndpoint.$error}"
                      >
                        <label :for="`source.${index}.sparqlEndpoint`">SPARQL Endpoint</label>
                        <input
                          v-model.trim="v.sparqlEndpoint.$model"
                          :name="`source.${index}.sparqlEndpoint`"
                        >
                        <p
                          v-if="!v.sparqlEndpoint.required"
                          class="invalid-feedback"
                        >
                          Field is required
                        </p>
                      </div>
                      <div
                        class="form__group"
                        :class="{'form__group--error': v.sparqlQuery.$error}"
                      >
                        <label :for="`source.${index}.sparqlQuery`">SPARQL Query</label>
                        <prism-editor
                          v-model="v.sparqlQuery.$model"
                          :name="`source.${index}.sparqlQuery`"
                          language="sparql"
                        />
                        <p
                          v-if="!v.sparqlQuery.required"
                          class="invalid-feedback"
                        >
                          Field is required
                        </p>
                      </div>
                    </div>
                    <a
                      class="text-danger ml-3 p-1"
                      @click.prevent="removeSource(index)"
                    >
                      <fa :icon="['fas', 'times']" />
                    </a>
                  </div>
                </li>
              </ul>

              <button
                class="btn btn-link"
                @click.prevent="addSource()"
              >
                <fa :icon="['fas', 'plus']" />
                Add
              </button>
            </div>

            <h2>Search</h2>

            <div class="form__group">
              <label>Filters</label>

              <ul>
                <li
                  v-for="(v, index) in $v.settings.search.filters.$each.$iter"
                  :key="`endpoint-${index}`"
                >
                  <div class="d-flex align-items-start">
                    <div class="flex-grow-1">
                      <div
                        class="form__group"
                        :class="{'form__group--error': v.label.$error}"
                      >
                        <label :for="`filter.${index}.label`">Label</label>
                        <input
                          v-model.trim="v.label.$model"
                          :name="`filter.${index}.label`"
                        >
                        <p
                          v-if="!v.label.required"
                          class="invalid-feedback"
                        >
                          Field is required
                        </p>
                      </div>

                      <div
                        class="form__group"
                        :class="{'form__group--error': v.predicate.$error}"
                      >
                        <label :for="`filter.${index}.predicate`">Predicate</label>
                        <input
                          v-model.trim="v.predicate.$model"
                          :name="`filter.${index}.predicate`"
                        >
                        <p
                          v-if="!v.predicate.required"
                          class="invalid-feedback"
                        >
                          Field is required
                        </p>
                        <p
                          v-if="!v.predicate.url"
                          class="invalid-feedback"
                        >
                          Field should be a valid URI
                        </p>
                      </div>

                      <div class="form__group">
                        <label :for="`filter.${index}.type`">Type</label>
                        <select
                          v-model="v.type.$model"
                          :name="`filter.${index}.type`"
                        >
                          <option value="IRI">
                            IRI
                          </option>
                          <option value="LITERAL">
                            LITERAL
                          </option>
                        </select>
                      </div>

                      <div class="form__group">
                        <label>
                          <input
                            v-model="v.queryFromRecords.$model"
                            :name="`filter.${index}.queryFromRecords`"
                            type="checkbox"
                          >
                          Query from records</label>
                      </div>

                      <div class="form__group">
                        <label>Values</label>
                        <ul>
                          <li
                            v-for="(valueV, valueIndex) in v.values.$each.$iter"
                            :key="`value-${valueIndex}`"
                          >
                            <div class="d-flex align-items-start">
                              <div class="flex-grow-1 d-flex">
                                <div
                                  class="flex-grow-1 form__group mr-4"
                                  :class="{'form__group--error': valueV.label.$error}"
                                >
                                  <label :for="`filter.${index}.values.${valueIndex}.label`">
                                    Label
                                  </label>
                                  <input
                                    v-model.trim="valueV.label.$model"
                                    :name="`filter.${index}.values.${valueIndex}.label`"
                                  >
                                  <p
                                    v-if="!valueV.label.required"
                                    class="invalid-feedback"
                                  >
                                    Field is required
                                  </p>
                                </div>
                                <div
                                  class="flex-grow-1 form__group"
                                  :class="{'form__group--error': valueV.value.$error}"
                                >
                                  <label :for="`filter.${index}.values.${valueIndex}.value`">
                                    Value
                                  </label>
                                  <input
                                    v-model.trim="valueV.value.$model"
                                    :name="`filter.${index}.values.${valueIndex}.value`"
                                  >
                                  <p
                                    v-if="!valueV.value.required"
                                    class="invalid-feedback"
                                  >
                                    Field is required
                                  </p>
                                </div>
                              </div>
                              <a
                                class="text-danger ml-3 p-1"
                                @click.prevent="removeFilterValue(index, valueIndex)"
                              >
                                <fa :icon="['fas', 'times']" />
                              </a>
                            </div>
                          </li>
                        </ul>

                        <button
                          class="btn btn-link"
                          @click.prevent="addFilterValue(index)"
                        >
                          <fa :icon="['fas', 'plus']" />
                          Add
                        </button>
                      </div>
                    </div>
                    <a
                      class="text-danger ml-3 p-1"
                      @click.prevent="removeFilter(index)"
                    >
                      <fa :icon="['fas', 'times']" />
                    </a>
                  </div>
                </li>
              </ul>

              <button
                class="btn btn-link"
                @click.prevent="addFilter()"
              >
                <fa :icon="['fas', 'plus']" />
                Add
              </button>
            </div>

            <div>
              <button
                class="btn btn-primary btn-rounded"
                :disabled="submitStatus.isPending()"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </template>
    </page>
  </div>
</template>
<script lang="ts">
import { required, url } from 'vuelidate/lib/validators'
import PrismEditor from 'vue-prism-editor'
import api from '@/api'
import Status from '@/utils/Status'
import Page from '../../components/Page/index.vue'
import StatusFlash from '../../components/StatusFlash/index.vue'

export default {
  name: 'FdpSettings',
  components: {
    Page,
    PrismEditor,
    StatusFlash,
  },

  validations() {
    return {
      settings: {
        appTitle: {},
        appSubtitle: {},
        metadataMetrics: {
          $each: {
            metricUri: { required, url },
            resourceUri: { required, url },
          },
        },
        ping: {
          enabled: { required },
          endpoints: {
            $each: {
              endpoint: { required, url },
            },
          },
        },
        forms: {
          autocomplete: {
            searchNamespace: { required },
            sources: {
              $each: {
                rdfType: { required },
                sparqlEndpoint: { required },
                sparqlQuery: { required },
              },
            },
          },
        },
        search: {
          filters: {
            $each: {
              type: { required },
              label: { required },
              predicate: { required, url },
              queryFromRecords: {},
              values: {
                $each: {
                  label: {},
                  value: { required },
                },
              },
            },
          },
        },
      },
    }
  },

  data() {
    return {
      status: new Status(),
      submitStatus: new Status(),
      settings: null,
      settingsData: null,
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
        const response = await api.settings.get()
        this.settingsData = response.data
        this.settings = this.requestDataToFormData(response.data)
        this.status.setDone()
      } catch (error) {
        this.status.setError('Unable to get settings')
      }
    },

    addMetadataMetric() {
      this.settings.metadataMetrics.push({
        metricUri: null,
        resourceUri: null,
      })
    },

    removeMetadataMetric(index) {
      this.settings.metadataMetrics.splice(index, 1)
    },

    addPingEndpoint() {
      this.settings.ping.endpoints.push({
        endpoint: null,
      })
    },

    removePingEndpoint(index) {
      this.settings.ping.endpoints.splice(index, 1)
    },

    addSource() {
      this.settings.forms.autocomplete.sources.push({
        rdfType: '',
        sparqlEndpoint: '',
        sparqlQuery: '',
      })
    },

    removeSource(index) {
      this.settings.forms.autocomplete.sources.splice(index, 1)
    },

    addFilter() {
      this.settings.search.filters.push({
        type: 'IRI',
        label: '',
        predicate: '',
        values: [],
        queryFromRecords: false,
      })
    },

    removeFilter(index) {
      this.settings.search.filters.splice(index, 1)
    },

    addFilterValue(filterIndex) {
      this.settings.search.filters[filterIndex].values.push({ value: null, label: null })
    },

    removeFilterValue(filterIndex, valueIndex) {
      this.settings.search.filters[filterIndex].values.splice(valueIndex, 1)
    },

    endpointsFromConfigVisible() {
      return this.settings.ping.endpointsFromConfig
        && this.settings.ping.endpointsFromConfig.length > 0
    },

    async submitSettings() {
      this.$v.settings.$touch()

      if (!this.$v.settings.$invalid) {
        try {
          this.submitStatus.setPending()
          const response = await api.settings.put(this.formDataToRequestData(this.settings))
          this.settings = this.requestDataToFormData(response.data)
          this.submitStatus.setDone('Settings were successfully updated!')
        } catch (error) {
          this.submitStatus.setError('Settings could not be updated.')
        } finally {
          window.scrollTo(0, 0)
        }
      }
    },

    formDataToRequestData(formData) {
      return {
        appTitle: formData.appTitle,
        appSubtitle: formData.appSubtitle,
        metadataMetrics: formData.metadataMetrics,
        ping: {
          enabled: formData.ping.enabled,
          endpoints: formData.ping.endpoints.map((e) => e.endpoint),
        },
        forms: formData.forms,
        search: formData.search,
      }
    },

    requestDataToFormData(requestData) {
      const formData = { ...requestData }
      formData.ping.endpoints = formData.ping.endpoints.map((endpoint) => ({ endpoint }))
      return formData
    },
  },
}
</script>
