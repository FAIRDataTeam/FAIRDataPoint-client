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
<script>
import Status from '../../utils/Status'

export default {
  name: 'StatusFlash',

  props: {
    status: {
      type: Status,
      required: true,
    },
    noLoading: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
