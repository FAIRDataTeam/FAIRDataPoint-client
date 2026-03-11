<template>
  <div>
    <page
      title="Trigger Ping"
      content-only
      small
    >
      <template #content>
        <status-flash :status="submitStatus" />
        <form
          class="form"
          @submit.prevent="submit"
        >
          <div class="form__group">
            <label for="fdp-url">FDP URL</label>
            <input
              id="fdp-url"
              v-model="fdpUrl"
              name="fdp-url"
              placeholder="Enter FDP URL"
            >
          </div>
          <div>
            <button
              class="btn btn-primary btn-rounded"
              :disabled="submitStatus.isPending()"
            >
              Submit
            </button>
          </div>
        </form>
      </template>
    </page>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import api from '@/api'
import Page from '@/components/Page/index.vue'
import Status from '../../utils/Status'
import StatusFlash from '../../components/StatusFlash/index.vue'

export default defineComponent({
  components: { Page, StatusFlash },
  data() {
    return {
      fdpUrl: '',
      submitStatus: new Status(),
    }
  },
  methods: {
    async submit() {
      if (this.fdpUrl.length > 0) {
        try {
          this.submitStatus.setPending()
          await api.fdpIndex.ping(this.fdpUrl)
          this.submitStatus.setDone('Successfully triggered ping!')
        } catch (error) {
          this.submitStatus.setError('Unable to trigger ping.')
        }
      }
    },
  },
})
</script>
