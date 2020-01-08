<template>
  <entity-edit :config="config" />
</template>
<script lang="ts">
import api from '../../api'
import breadcrumbs from '../../utils/breadcrumbs'
import EntityEdit from '../../components/EntityEdit/index.vue'
import urls from '../../utils/urls'

export default {
  name: 'CatalogEdit',
  components: { EntityEdit },

  data() {
    return {
      config: {
        getEntity: api.catalog.getCatalog,
        getEntitySpec: api.catalog.getCatalogSpec,
        putEntity: api.catalog.putCatalog,
        toUrl: urls.catalog,
        createBreadcrumbs: breadcrumbs.fromLinksWithCatalog,
      },
    }
  },
}
</script>
