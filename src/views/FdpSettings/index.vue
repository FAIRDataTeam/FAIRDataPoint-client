<template>
  <div>
    <page
      title="Settings"
      content-only
      small
    >
      <template v-slot:content>
        <status-flash :status="status" />
        <div v-if="settings">
          <form
            class="form"
            @submit.prevent="submitSettings"
          >
            <status-flash :status="submitStatus" />

            <h2>Client</h2>

            <div class="form__group">
              <label for="clientUrl">Client URL</label>
              <input
                id="clientUrl"
                :value="settingsData.clientUrl"
                disabled
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

            <h2>Ping</h2>

            <div class="form__group">
              <label for="users">
                <input
                  id="users"
                  v-model="$v.settings.ping.enabled"
                  type="checkbox"
                > Enabled
              </label>
            </div>

            <div class="form__group">
              <label>Endpoints</label>
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

            <h2>Repository</h2>

            <div class="form__group">
              <label for="repository">Repository</label>
              <input
                id="repository"
                :value="settingsData.repository.type"
                disabled
              >
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
import api from '@/api'
import Page from '../../components/Page/index.vue'
import Status from '@/utils/Status'
import StatusFlash from '../../components/StatusFlash/index.vue'

export default {
  name: 'FdpSettings',
  components: {
    Page,
    StatusFlash,
  },

  validations() {
    return {
      settings: {
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

    async submitSettings() {
      this.$v.settings.$touch()

      if (!this.$v.settings.$invalid) {
        try {
          this.submitStatus.setPending()
          const response = await api.settings.put(this.fromDataToRequestData(this.settings))
          this.settings = this.requestDataToFormData(response.data)
          this.submitStatus.setDone('Settings were successfully updated!')
        } catch (error) {
          this.submitStatus.setError('Settings could not be updated.')
        } finally {
          window.scrollTo(0, 0)
        }
      }
    },

    fromDataToRequestData(formData) {
      return {
        metadataMetrics: formData.metadataMetrics,
        ping: {
          enabled: formData.ping.enabled,
          endpoints: formData.ping.endpoints.map(e => e.endpoint),
        },
      }
    },

    requestDataToFormData(requestData) {
      const formData = { ...requestData }
      formData.ping.endpoints = formData.ping.endpoints.map(endpoint => ({ endpoint }))
      return formData
    },
  },
}
</script>
