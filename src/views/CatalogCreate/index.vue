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

@Component({ components: { EntityCreate } })
export default class CatalogCreate extends Vue {
  config = {
    createName: 'Create Catalog',
    parentApi: api.repository,
    api: api.builder.build('catalog'),
    getEntityUrl: urls.catalog,
    getParentUrl: urls.repository,
    createBreadcrumbs: breadcrumbs.fromRepository,
    isAllowed: () => true,
    isPartOf: rdfUtils.repositorySubject,
    shape: 'CatalogShape',
    filter: SHACLParser.filterBlacklist(fieldBlacklist.catalog),
  }
}
</script>
