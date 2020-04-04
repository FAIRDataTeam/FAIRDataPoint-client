<template>
  <entity-create :config="config" />
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import api from '../../api'
import breadcrumbs from '../../utils/breadcrumbs'
import EntityCreate from '../../components/EntityCreate/index.vue'
import urls from '../../utils/urls'
import rdfUtils from '@/rdf/utils'
import { SHACLParser } from '@/components/ShaclForm/SHACLParser'
import fieldBlacklist from '@/rdf/fieldBlacklist'
import permissions from '../../utils/permissions'

@Component({ components: { EntityCreate } })
export default class DistributionCreate extends Vue {
  config = {
    createName: 'Create Distribution',
    parentApi: api.builder.build('dataset'),
    api: api.builder.build('distribution'),
    getEntityUrl: urls.distribution,
    getParentUrl: urls.dataset,
    createBreadcrumbs: breadcrumbs.fromWithDataset,
    isAllowed: permissions.hasCreate,
    isPartOf: rdfUtils.datasetSubject,
    shape: 'DistributionShape',
    filter: SHACLParser.filterBlacklist(fieldBlacklist.distribution),
  }
}
</script>
