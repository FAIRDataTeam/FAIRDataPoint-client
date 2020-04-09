<template>
  <entity-create :config="config" />
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import api from '../../api'
import breadcrumbs from '../../utils/breadcrumbs'
import EntityCreate from '../../components/EntityCreate/index.vue'
import urls from '../../utils/urls'
import permissions from '../../utils/permissions'
import formModels from '@/rdf/formModels'

@Component({ components: { EntityCreate } })
export default class DatasetCreate extends Vue {
  config = {
    createName: 'Create Dataset',
    parentApi: api.builder.build('catalog'),
    api: api.builder.build('dataset'),
    getEntityUrl: urls.dataset,
    getParentUrl: urls.catalog,
    createBreadcrumbs: breadcrumbs.fromWithCatalog,
    isAllowed: permissions.hasCreate,
    formModel: formModels.dataset,
  }
}
</script>
