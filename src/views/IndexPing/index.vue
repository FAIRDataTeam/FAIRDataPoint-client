<template>
  <div>
    <page
      title="Trigger Ping"
      content-only
      small
    >
      <template v-slot:content>
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
import { Component, Vue } from 'vue-property-decorator'
import api from '@/api'
import Page from '@/components/Page/index.vue'
import Status from '../../utils/Status'
import StatusFlash from '../../components/StatusFlash/index.vue'

@Component({ components: { Page, StatusFlash } })
export default class IndexPing extends Vue {
  fdpUrl: string = ''

  submitStatus: Status = new Status()

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
  }
}
</script>
