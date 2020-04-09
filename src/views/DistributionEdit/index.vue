<template>
  <entity-edit :config="config" />
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import api from '../../api'
import breadcrumbs from '../../utils/breadcrumbs'
import EntityEdit from '../../components/EntityEdit/index.vue'
import urls from '../../utils/urls'
import rdfUtils from '@/rdf/utils'
import formModels from '@/rdf/formModels'

@Component({ components: { EntityEdit } })
export default class DistributionEdit extends Vue {
  config = {
    api: api.builder.build('distribution'),
    shape: 'DistributionShape',
    getSubject: rdfUtils.distributionSubject,
    toUrl: urls.distribution,
    createBreadcrumbs: breadcrumbs.fromWithDistribution,
    formModel: formModels.distribution,
  }
}
</script>
