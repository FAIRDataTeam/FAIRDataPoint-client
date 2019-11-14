<template>
  <EntitySettings :config="config" />
</template>
<script>
import api from '../../api'
import EntitySettings from '../../components/EntitySettings'

export default {
  name: 'DatasetSettings',
  components: { EntitySettings },
  data() {
    return {
      config: {
        getEntity: api.getDataset,
        getEntityMembers: api.getDatasetMembers,
        putEntityMember: api.putDatasetMember,
        deleteEntityMember: api.deleteDatasetMember,
        entityType: 'DATASET',
        createBreadcrumbs(dataset) {
          return [{
            label: dataset.links.repository.label,
            to: '/fdp',
          }, {
            label: dataset.links.catalog.label,
            to: `/fdp/catalog/${dataset.links.catalog.identifier}`,
          }, {
            label: dataset.title,
            to: `/fdp/dataset/${dataset.identifier}`,
          }]
        },
      },
    }
  },
}
</script>
