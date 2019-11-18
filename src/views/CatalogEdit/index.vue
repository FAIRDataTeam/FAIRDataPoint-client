<template>
  <EntityEdit :config="config" />
</template>
<script>
import api from '../../api'
import breadcrumbs from '../../utils/breadcrumbs'
import EntityEdit from '../../components/EntityEdit'
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
