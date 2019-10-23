<template>
  <div class="footer-wrapper">
    <div class="footer">
      <div class="footer__container">
        Footer
      </div>
      <Separator />
    </div>
  </div>
</template>
<script>
import Separator from './Separator.vue'

export default {
  name: 'Footer',
  components: { Separator },
}
</script>
<style scoped lang="scss">
@import "../scss/variables";
@import "../scss/mixins";
@import "../scss/text-styles";

.footer-wrapper {
  flex-grow: 1;
  display: flex;
  align-items: flex-end;
}

.footer {
  width: 100%;
  margin-top: $footer-margin-top;
  border-top: $border-width-line solid $color-separator;

  &__container {
    max-width: $container-max-width;
    min-height: $footer-min-height;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    margin: auto;
    padding: 0 $space-sm;
  }
}
</style>
