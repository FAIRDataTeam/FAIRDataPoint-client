<template>
  <div v-if="data">
    <div v-if="data.length > 0">
      <table class="table table-hover">
        <thead>
          <tr>
            <slot name="header" />
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in orderBy(data, 'name')"
            :key="row.uuid"
          >
            <slot
              name="row"
              v-bind="row"
            />
          </tr>
        </tbody>
      </table>
    </div>
    <div
      v-if="data.length === 0"
      class="alert alert-light"
    >
      <slot name="empty" />
    </div>
  </div>
</template>
<script>
import _ from 'lodash'

export default {
  name: 'Table',

  props: {
    data: {
      validator: prop => Array.isArray(prop) || prop == null,
      required: true,
    },
  },

  methods: {
    orderBy(list, prop) {
      return _.orderBy(list, prop)
    },
  },
}
</script>
<style scoped lang="scss">
@import "../scss/variables";
@import "../scss/text-styles";

.table {
  width: 100%;
  border-collapse: collapse;

  th {
    @include text-style-default-16-semibold;
    border-bottom: 2px solid $color-separator;
    text-align: left;
  }

  td {
    @include text-style-default-16;
    border-bottom: 1px solid $color-separator;
  }

  th, td {
    padding: $space-sm;
  }

  tbody {
    tr:hover {
      background: $color-background-highlighted;
    }
  }
}
</style>
