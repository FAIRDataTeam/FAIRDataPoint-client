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
        api: api.builder.build('catalog'),
        getSubject: rdfUtils.catalogSubject,
        entityType: 'CATALOG',
        createBreadcrumbs: breadcrumbs.fromWithCatalog,
      },
    }
  },
}
</script>
