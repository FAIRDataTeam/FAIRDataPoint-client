<template>
  <div>
    <page
      title="Reset to defaults"
      content-only
      small
    >
      <template #content>
        <form
          class="form"
          @submit.prevent="submit"
        >
          <status-flash
            :status="status"
            no-loading
          />
          <div class="form__group">
            <label for="users">
              <input
                id="users"
                v-model="reset.users"
                type="checkbox"
              > <strong>Users</strong>
            </label>
            <p>Delete all existing users and create default user accounts.</p>
          </div>
          <div class="form__group">
            <label for="metadata">
              <input
                id="metadata"
                v-model="reset.metadata"
                type="checkbox"
              > <strong>Metadata</strong>
            </label>
            <p>Delete all existing metadata and create the default repository.</p>
          </div>
          <div class="form__group">
            <label for="resource-definitions">
              <input
                id="resource-definitions"
                v-model="reset.resourceDefinitions"
                type="checkbox"
              > <strong>Resource Definitions</strong>
            </label>
            <p>
              Delete all existing resource definitions and metadata schemas and create the default
              ones.
            </p>
          </div>
          <div class="form__group">
            <label for="settings">
              <input
                id="settings"
                v-model="reset.settings"
                type="checkbox"
              > <strong>Settings</strong>
            </label>
            <p>
              Reset all settings options to the default values.
            </p>
          </div>
          <div>
            <button
              class="btn btn-primary btn-danger btn-rounded"
              :disabled="status.isPending() || !anySelected"
            >
              Reset
            </button>
          </div>
        </form>
      </template>
    </page>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import Status from '@/utils/Status'
import api from '../../api'
import Page from '../../components/Page/index.vue'
import StatusFlash from '../../components/StatusFlash/index.vue'

export default defineComponent({
  components: { Page, StatusFlash },
  data() {
    return {
      reset: {
        users: false,
        metadata: false,
        resourceDefinitions: false,
        settings: false,
      },
      status: new Status(),
    }
  },
  computed: {
    anySelected() {
      return this.reset.users || this.reset.metadata || this.reset.resourceDefinitions
        || this.reset.settings
    },
  },
  methods: {
    async submit() {
      if (!this.anySelected) return
      if (!window.confirm('This action cannot be undone, are you sure you want to continue?')) return

      try {
        await api.reset.postReset(this.reset)
        this.logout()
      } catch (error) {
        this.status.setError('FDP could not be reset.')
      }
    },
    logout() {
      this.$store.dispatch('auth/logout')
      this.$router.push('/')
      window.location.reload()
    },
  },
})
</script>
