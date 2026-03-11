<template>
  <div class="version-info-table">
    <table class="table table-borderless">
      <thead>
        <tr>
          <th colspan="2">
            {{ title }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>Version</th>
          <td><code>{{ version.slice(0, 36) }}</code></td>
        </tr>
        <tr>
          <th>Built at</th>
          <td>{{ builtAtFormatted }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import moment from 'moment'

export default defineComponent({
  props: {
    title: { type: String, required: true },
    version: { type: String, required: true },
    builtAt: { type: String, required: true },
  },
  computed: {
    builtAtFormatted() {
      return moment(this.builtAt).format('D. M. YYYY, HH:mm')
    },
  },
})
</script>
