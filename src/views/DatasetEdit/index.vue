<template>
  <EntityEdit :config="config" />
</template>
<script>
import api from '../../api'
import breadcrumbs from '../../utils/breadcrumbs'
import EntityEdit from '../../components/EntityEdit'
import urls from '../../utils/urls'

export default {
  name: 'DatasetEdit',
  components: { EntityEdit },
  data() {
    return {
      config: {
        getEntity: api.dataset.getDataset,
        getEntitySpec: api.dataset.getDatasetSpec,
        putEntity: api.dataset.putDataset,
        toUrl: urls.dataset,
        createBreadcrumbs: breadcrumbs.fromLinksWithDataset,
      },
    }
  },
}
</script>
