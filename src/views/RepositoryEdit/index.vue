<template>
  <entity-edit :config="config" />
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import EntityEdit from '../../components/EntityEdit/index.vue'
import repositoryConfig from '@/entity/RepositoryConfig'

@Component({ components: { EntityEdit } })
export default class DistributionEdit extends Vue {
  config = repositoryConfig
}
</script>
