<template>
  <entity-view :config="config" />
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import EntityView from '@/components/EntityView/index.vue'
import repositoryConfig from '@/entity/RepositoryConfig'


@Component({ components: { EntityView } })
export default class Repository extends Vue {
  config = repositoryConfig
}
</script>
