<template>
  <div class="footer">
    <div class="footer__inner">
      <div class="footer__container">
        FAIR Data Point
      </div>
      <separator />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Separator from '../Separator/index.vue'

@Component({ components: { Separator } })
export default class FdpFooter extends Vue {
}
</script>
