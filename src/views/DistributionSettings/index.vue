<template>
  <entity-settings :config="config" />
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import api from '../../api'
import breadcrumbs from '../../utils/breadcrumbs'
import EntitySettings from '../../components/EntitySettings/index.vue'
import rdfUtils from '@/rdf/utils'

@Component({ components: { EntitySettings } })
export default class DistributionSettings extends Vue {
  config = {
    api: api.builder.build('distribution'),
    getSubject: rdfUtils.distributionSubject,
    entityType: 'DISTRIBUTION',
    createBreadcrumbs: breadcrumbs.fromWithDistribution,
  }
}
</script>
