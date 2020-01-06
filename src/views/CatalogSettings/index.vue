<template>
  <entity-settings :config="config" />
</template>
<script>
import api from '../../api'
import EntitySettings from '../../components/EntitySettings'
import breadcrumbs from '../../utils/breadcrumbs'

export default {
  name: 'CatalogSettings',
  components: { EntitySettings },
  data() {
    return {
      config: {
        getEntity: api.catalog.getCatalog,
        getEntityMembers: api.catalog.getCatalogMembers,
        putEntityMember: api.catalog.putCatalogMember,
        deleteEntityMember: api.catalog.deleteCatalogMember,
        entityType: 'CATALOG',
        createBreadcrumbs: breadcrumbs.fromLinksWithCatalog,
      },
    }
  },
}

</script>
