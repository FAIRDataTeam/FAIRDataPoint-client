<template>
  <div class="status-flash">
    <div
      v-if="!status.isDefault()"
      :class="{
        'loader': status.isPending() && !noLoading,
        'status-flash__alert status-flash__alert--danger': status.isError(),
        'status-flash__alert status-flash__alert--success': status.isSuccess()
      }"
    >
      <template v-if="status.isPending() && !noLoading">
        <fa
          :icon="['fas', 'spinner']"
          spin
        />
        Loading...
      </template>
      <template v-if="status.message">
        {{ status.message }}
      </template>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import Status from '../../utils/Status'

@Component
export default class StatusFlash extends Vue {
  @Prop({ type: Status, required: true })
  readonly status: Status

  @Prop({ type: Boolean, default: false })
  readonly noLoading: boolean
}
</script>
