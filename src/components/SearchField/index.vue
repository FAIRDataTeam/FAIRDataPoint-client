<template>
  <div class="search-field">
    <fa :icon="['fas', 'search']" />
    <input
      type="text"
      placeholder="Search FAIR Data Point..."
    >
  </div>
</template>
<script>
export default {
  name: 'SearchField',
}
</script>
