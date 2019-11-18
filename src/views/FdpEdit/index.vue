<template>
  <EntityEdit :config="config" />
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
        getEntity: api.fdp.getFdp,
        getEntitySpec: api.fdp.getFdpSpec,
        putEntity: (_, data) => api.fdp.putFdp(data),
        toUrl: urls.repository,
        createBreadcrumbs: breadcrumbs.fromRepository,
      },
    }
  },
}
</script>
