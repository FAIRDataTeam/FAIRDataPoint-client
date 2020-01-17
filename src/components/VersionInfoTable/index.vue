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
import moment from 'moment'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class VersionInfoTable extends Vue {
  @Prop({ type: String, required: true })
  readonly title: string

  @Prop({ type: String, required: true })
  readonly version: string

  @Prop({ type: String, required: true })
  readonly builtAt: string

  get builtAtFormatted() {
    return moment(this.builtAt).format('D. M. YYYY, HH:mm')
  }
}
</script>
