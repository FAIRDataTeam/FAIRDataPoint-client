<template>
  <div>
    <page
      title="API Keys"
      content-only
    >
      <template #actions>
        <btn
          class="btn btn-link"
          @click="generateApiKey()"
        >
          + Generate API Key
        </btn>
      </template>
      <template #content>
        <status-flash :status="status" />
        <div class="item-list">
          <div
            v-for="apiKey in apiKeys"
            :key="apiKey.uuid"
            class="item-list__item item-list__item--simple"
          >
            <div class="content">
              {{ apiKey.token }}
            </div>
            <div class="actions">
              <a
                class="text-danger"
                @click="deleteApiKey(apiKey)"
              >
                <fa :icon="['far', 'trash-alt']" />
                Remove
              </a>
            </div>
          </div>
          <div v-if="apiKeys.length === 0">
            You have no API keys yet.
          </div>
        </div>
      </template>
    </page>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import Page from '@/components/Page/index.vue'
import Status from '@/utils/Status'
import api from '../../api'
import StatusFlash from '../../components/StatusFlash/index.vue'

export default defineComponent({
  components: { Page, StatusFlash },
  data() {
    return {
      status: new Status(),
      apiKeys: [] as any[],
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
        const response = await api.apiKeys.getApiKeys()
        this.apiKeys = response.data
        this.status.setDone()
      } catch (error) {
        this.status.setError('Unable to get API keys.')
      }
    },
    async deleteApiKey(apiKey) {
      if (window.confirm('Are you sure you want to delete the API key?')) {
        try {
          await api.apiKeys.deleteApiKey(apiKey)
          this.fetchData()
        } catch (error) {
          this.status.setError('Unable to delete API key.')
        }
      }
    },
    async generateApiKey() {
      try {
        this.status.setPending()
        await api.apiKeys.postApiKey()
        this.status.setDone()
        await this.fetchData()
      } catch (error) {
        this.status.setError('Unable to generate API key.')
      }
    },
  },
})
</script>
