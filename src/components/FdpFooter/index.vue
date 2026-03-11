<template>
  <div class="footer">
    <div class="footer__inner">
      <div class="footer__container">
        <div>
          <span>{{ appTitle }}</span>
          <span class="footer__separator">&middot;</span>
          <a
            v-b-modal.info-modal
            href="#"
            @click.prevent=""
          >About</a>
        </div>
      </div>
      <separator />
    </div>
    <b-modal
      id="info-modal"
      hide-footer
      title="About"
    >
      <version-info-table
        title="Server"
        :version="info.version"
        :built-at="info.builtAt"
      />
      <version-info-table
        title="Client"
        version="{version}"
        built-at="{builtAt}"
      />
    </b-modal>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import api from '@/api'
import config from '@/config'
import Separator from '../Separator/index.vue'
import VersionInfoTable from '../VersionInfoTable/index.vue'

export default defineComponent({
  components: { Separator, VersionInfoTable },
  data() {
    return {
      info: { version: '', builtAt: '' } as any,
    }
  },
  computed: {
    appTitle() {
      return config.appTitle()
    },
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData(): Promise<void> {
      const response = await api.info.getInfo()
      this.info = response.data
    },
  },
})
</script>
