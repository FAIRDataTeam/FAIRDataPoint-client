<template>
  <EntitySettings :config="config" />
</template>
<script>
import * as api from '../api'
import EntitySettings from '../components/EntitySettings.vue'

export default {
  name: 'CatalogSettings',
  components: { EntitySettings },
  data() {
    return {
      config: {
        getEntity: api.getCatalog,
        getEntityMembers: api.getCatalogMembers,
        putEntityMember: api.putCatalogMember,
        deleteEntityMember: api.deleteCatalogMember,
        entityType: 'CATALOG',
        createBreadcrumbs(catalog) {
          return [{
            label: catalog.links.repository.label,
            to: '/fdp',
          }, {
            label: catalog.title,
            to: `/fdp/catalog/${catalog.identifier}`,
          }]
        },
      },
    }
  },
}

</script>
