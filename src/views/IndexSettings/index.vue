<template>
  <div>
    <page
      title="Index Settings"
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

            <div class="form__group">
              <label for="auto-permit">
                <input
                  id="auto-permit"
                  v-model.trim="v$.settings.autoPermit.$model"
                  type="checkbox"
                >
                Auto Permit
              </label>
            </div>

            <h2>Retrieval</h2>

            <div
              class="form__group"
              :class="{ 'form__group--error': v$.settings.retrieval.rateLimitWait.$error }"
            >
              <label for="retrieval-rateLimitWait">Rate Limit Wait</label>
              <input
                id="retrieval-rateLimitWait"
                v-model.trim="v$.settings.retrieval.rateLimitWait.$model"
                name="rateLimitWait"
              >
              <p
                v-if="!v$.settings.retrieval.rateLimitWait.required"
                class="invalid-feedback"
              >
                Field is required
              </p>
            </div>
            <div
              class="form__group"
              :class="{ 'form__group--error': v$.settings.retrieval.timeout.$error }"
            >
              <label for="retrieval-timeout">Timeout</label>
              <input
                id="retrieval-timeout"
                v-model.trim="v$.settings.retrieval.timeout.$model"
                name="timeout"
              >
              <p
                v-if="!v$.settings.retrieval.timeout.required"
                class="invalid-feedback"
              >
                Field is required
              </p>
            </div>

            <h2>Ping</h2>

            <div
              class="form__group"
              :class="{ 'form__group--error': v$.settings.ping.validDuration.$error }"
            >
              <label for="ping-validDuration">Valid Duration</label>
              <input
                id="ping-validDuration"
                v-model.trim="v$.settings.ping.validDuration.$model"
                name="validDuration"
              >
              <p
                v-if="!v$.settings.ping.validDuration.required"
                class="invalid-feedback"
              >
                Field is required
              </p>
            </div>
            <div
              class="form__group"
              :class="{ 'form__group--error': v$.settings.ping.rateLimitDuration.$error }"
            >
              <label for="ping-rateLimitDuration">Rate Limit Duration</label>
              <input
                id="ping-rateLimitDuration"
                v-model.trim="v$.settings.ping.rateLimitDuration.$model"
                name="rateLimitDuration"
              >
              <p
                v-if="!v$.settings.ping.rateLimitDuration.required"
                class="invalid-feedback"
              >
                Field is required
              </p>
            </div>
            <div
              class="form__group"
              :class="{ 'form__group--error': v$.settings.ping.rateLimitHits.$error }"
            >
              <label for="ping-rateLimitHits">Rate Limit Hits</label>
              <input
                id="ping-rateLimitHits"
                v-model.trim="v$.settings.ping.rateLimitHits.$model"
                name="rateLimitHits"
              >
              <p
                v-if="!v$.settings.ping.rateLimitHits.required"
                class="invalid-feedback"
              >
                Field is required
              </p>
            </div>
            <div
              class="form__group"
              :class="{ 'form__group--error': v$.settings.ping.denyList.$error }"
            >
              <label>Deny List</label>
              <ul>
                <li
                  v-for="(v, index) in v$.settings.ping.denyList.$each.$iter"
                  :key="`deny-item-${index}`"
                >
                  <div class="d-flex align-items-start">
                    <div class="form-group flex-grow-1">
                      <input
                        v-model.trim="v.item.$model"
                        :name="`denyLink.${index}`"
                        class="input-field"
                      >
                    </div>
                    <a
                      class="text-danger ms-3 p-1"
                      :data-cy="`denyLink.${index}.remove`"
                      @click.prevent="removeDenyLink(index)"
                    >
                      <fa :icon="['fas', 'times']" />
                    </a>
                  </div>
                </li>
              </ul>
              <button
                class="btn btn-link"
                data-cy="add-external-link"
                @click.prevent="addDenyLink()"
              >
                <fa :icon="['fas', 'plus']" />
                Add
              </button>
            </div>

            <div class="d-flex justify-content-between">
              <button
                class="btn btn-primary btn-rounded"
                :disabled="submitStatus.isPending()"
              >
                Save
              </button>
              <button
                v-if="!settings.isDefault"
                class="btn btn-secondary btn-rounded"
                :disabled="submitStatus.isPending()"
                @click.prevent="resetToDefaults"
              >
                Reset to defaults
              </button>
            </div>
          </form>
        </div>
      </template>
    </page>
  </div>
</template>
<script lang="ts">
import { useVuelidate } from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import _ from 'lodash'
import api from '@/api'
import Status from '@/utils/Status'
import Page from '../../components/Page/index.vue'
import StatusFlash from '../../components/StatusFlash/index.vue'

export default {
  name: 'IndexSettings',
  components: {
    Page,
    StatusFlash,
  },
  setup() {
    return { v$: useVuelidate() }
  },

  validations() {
    return {
      settings: {
        autoPermit: { required },
        retrieval: {
          rateLimitWait: { required },
          timeout: { required },
        },
        ping: {
          validDuration: { required },
          rateLimitDuration: { required },
          rateLimitHits: { required },
          denyList: {
            $each: helpers.forEach({ item: {} }),
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
        const response = await api.fdpIndex.getSettings()
        this.settings = this.requestDataToFormData(response.data)
        this.status.setDone()
      } catch (error) {
        this.status.setError('Unable to get settings')
      }
    },

    async submitSettings() {
      this.v$.settings.$touch()

      if (!this.v$.settings.$invalid) {
        try {
          this.sanitizeDenyList()
          this.submitStatus.setPending()
          const response = await api.fdpIndex.putSettings(this.fromDataToRequestData(this.settings))
          this.settings = this.requestDataToFormData(response.data)
          this.submitStatus.setDone('Settings were successfully updated!')
        } catch (error) {
          this.submitStatus.setError('Settings could not be updated.')
        }
      }
    },

    async resetToDefaults() {
      if (window.confirm('Are you sure you want to reset settings to defaults?')) {
        try {
          this.submitStatus.setPending()
          const response = await api.fdpIndex.deleteSettings()
          this.settings = this.requestDataToFormData(response.data)
          this.submitStatus.setDone('Settings were successfully reset to defaults!')
        } catch (error) {
          this.submitStatus.setError('Settings could not be reset to defaults!')
        }
      }
    },

    sanitizeDenyList() {
      const filter = (i) => !_.isEmpty(i.item)
      this.settings.ping.denyList = this.settings.ping.denyList.filter(filter)
    },

    fromDataToRequestData(formData) {
      const data = {
        autoPermit: formData.autoPermit,
        ping: { ...formData.ping },
        retrieval: { ...formData.retrieval },
      }
      data.ping.denyList = data.ping.denyList.map((i) => i.item)
      return data
    },

    requestDataToFormData(requestData) {
      const formData = { ...requestData }
      formData.ping.denyList = formData.ping.denyList.map((item) => ({ item }))
      return formData
    },

    addDenyLink() {
      this.settings.ping.denyList.push({ item: '' })
    },

    removeDenyLink(index) {
      this.settings.ping.denyList.splice(index, 1)
    },
  },
}
</script>
