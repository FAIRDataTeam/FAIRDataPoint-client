<template>
  <div class="separator" />
</template>
<script>
export default {
  name: 'Separator',
}
</script>
<style scoped lang="scss">
@import "../scss/variables";
@import "../scss/mixins";

.separator {
  width: 100%;
  height: $separator-colorful-height;
  @include linear-gradient(90deg, $color-primary, $color-complementary);
}
</style>
