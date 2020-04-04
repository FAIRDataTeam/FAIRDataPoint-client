<template>
  <entity-settings :config="config" />
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import api from '../../api'
import EntitySettings from '../../components/EntitySettings/index.vue'
import breadcrumbs from '../../utils/breadcrumbs'
import rdfUtils from '@/rdf/utils'

@Component({ components: { EntitySettings } })
export default class CatalogSettings extends Vue {
  config = {
    api: api.builder.build('catalog'),
    getSubject: rdfUtils.catalogSubject,
    entityType: 'CATALOG',
    createBreadcrumbs: breadcrumbs.fromWithCatalog,
  }
}
</script>
