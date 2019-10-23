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
      <template v-if="status.isError()">
        {{ status.errorMsg }}
      </template>
      <template v-if="status.isSuccess()">
        {{ status.successMsg }}
      </template>
    </div>
  </div>
</template>
<script>
import Status from '../utils/Status'

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
<style scoped lang="scss">
@import "../scss/variables";

.status-flash {
  margin: $space-sm 0;

  & > div {
    width: 100%;
    max-width: $container-max-width;
    margin: auto;
    box-sizing: border-box;
  }

  &__alert {
    border-left: 5px solid $color-text-default;
    color: $color-text-default;
    background: $color-background-highlighted;
    padding: $space-sm $space-md $space-sm $space-sm;

    &--success {
      color: $color-success;
      background: $color-success-light;
      border-left-color: $color-success;
    }

    &--danger {
      color: $color-danger;
      background: $color-danger-light;
      border-left-color: $color-danger;
    }
  }
}

.loader {
  color: #aaa;
  text-align: center;
  margin: 3rem 0;
  opacity: 1;
  -webkit-animation: fadein 3s; /* Safari, Chrome and Opera > 12.1 */
  -moz-animation: fadein 3s; /* Firefox < 16 */
  -ms-animation: fadein 3s; /* Internet Explorer */
  -o-animation: fadein 3s; /* Opera < 12.1 */
  animation: fadein 3s;
}

@keyframes fadein {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Firefox < 16 */
@-moz-keyframes fadein {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Safari, Chrome and Opera > 12.1 */
@-webkit-keyframes fadein {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Internet Explorer */
@-ms-keyframes fadein {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Opera < 12.1 */
@-o-keyframes fadein {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
