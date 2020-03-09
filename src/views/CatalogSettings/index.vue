<template>
  <entity-settings :config="config" />
</template>
<script lang="ts">
import api from '../../api'
import EntitySettings from '../../components/EntitySettings/index.vue'
import breadcrumbs from '../../utils/breadcrumbs'
import rdfUtils from '@/rdf/utils'

export default {
  name: 'CatalogSettings',
  components: { EntitySettings },
  data() {
    return {
      config: {
        getSubject: rdfUtils.catalogSubject,
        getEntity: api.catalog.getCatalog,
        getEntityMembers: api.catalog.getCatalogMembers,
        putEntityMember: api.catalog.putCatalogMember,
        deleteEntityMember: api.catalog.deleteCatalogMember,
        entityType: 'CATALOG',
        createBreadcrumbs: breadcrumbs.fromWithCatalog,
      },
    }
  },
}
</script>
