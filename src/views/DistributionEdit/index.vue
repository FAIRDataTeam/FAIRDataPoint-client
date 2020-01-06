<template>
  <entity-edit :config="config" />
</template>
<script>
import api from '../../api'
import breadcrumbs from '../../utils/breadcrumbs'
import EntityEdit from '../../components/EntityEdit'
import urls from '../../utils/urls'

export default {
  name: 'DistributionEdit',
  components: { EntityEdit },

  data() {
    return {
      config: {
        getEntity: api.distribution.getDistribution,
        getEntitySpec: api.distribution.getDistributionSpec,
        putEntity: api.distribution.putDistribution,
        toUrl: urls.distribution,
        createBreadcrumbs: breadcrumbs.fromLinksWithDistribution,
      },
    }
  },
}
</script>
