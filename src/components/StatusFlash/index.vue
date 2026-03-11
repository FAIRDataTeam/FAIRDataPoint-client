<template>
  <div class="status-flash">
    <div
      v-if="!status.isDefault()"
      :class="{
        loader: status.isPending() && !noLoading,
        'status-flash__alert status-flash__alert--danger': status.isError(),
        'status-flash__alert status-flash__alert--success': status.isSuccess(),
      }"
    >
      <template v-if="status.isPending() && !noLoading">
        <fa
          :icon="['fas', 'spinner']"
          spin
        />
        Loading...
      </template>
      <template v-else-if="status.errorCode === 403">
        403 You are not allowed to see this content
      </template>
      <template v-else-if="status.errorCode === 404">
        404 Not Found
      </template>
      <template v-else-if="status.message">
        {{ status.message }}
        <slot name="extra-content" />
      </template>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import Status from '../../utils/Status'

export default defineComponent({
  props: {
    status: { type: Object as PropType<Status>, required: true },
    noLoading: { type: Boolean, default: false },
  },
})
</script>
