<template>
  <div>
    <page
      title="API Keys"
      content-only
    >
      <template v-slot:actions>
        <btn
          class="btn btn-link"
          @click="generateApiKey()"
        >
          + Generate API Key
        </btn>
      </template>
      <template v-slot:content>
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
import { Component, Vue, Watch } from 'vue-property-decorator'
import api from '../../api'
import ItemSimple from '../../components/ItemSimple/index.vue'
import Page from '@/components/Page/index.vue'
import Status from '@/utils/Status'
import StatusFlash from '../../components/StatusFlash/index.vue'

@Component({ components: { Page, StatusFlash, ItemSimple } })
export default class ApiKeys extends Vue {
  status: Status = new Status()

  apiKeys: any = null

  created() {
    this.fetchData()
  }

  @Watch('$route')
  async fetchData() {
    try {
      this.status.setPending()
      const response = await api.apiKeys.getApiKeys()
      this.apiKeys = response.data
      this.status.setDone()
    } catch (error) {
      this.status.setError('Unable to get API keys.')
    }
  }

  async deleteApiKey(apiKey) {
    if (window.confirm('Are you sure you want to delete the API key?')) {
      try {
        await api.apiKeys.deleteApiKey(apiKey)
        this.fetchData()
      } catch (error) {
        this.status.setError('Unable to delete API key.')
      }
    }
  }

  async generateApiKey() {
    try {
      this.status.setPending()
      await api.apiKeys.postApiKey({})
      this.status.setDone()
      await this.fetchData()
    } catch (error) {
      this.status.setError('Unable to generate API key.')
    }
  }
}
</script>
