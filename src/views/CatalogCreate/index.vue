<template>
  <entity-create :config="config" />
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import api from '../../api'
import breadcrumbs from '../../utils/breadcrumbs'
import EntityCreate from '../../components/EntityCreate/index.vue'
import urls from '../../utils/urls'
import formModels from '@/rdf/formModels'

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
    formModel: formModels.catalog,
  }
}
</script>
