<template>
  <div>
    <Breadcrumbs
      v-if="entity !== null"
      :links="breadcrumbs"
      current="Edit"
    />
    <StatusFlash :status="status" />
    <Page
      v-if="entity !== null"
      :title="`Edit ${entity.title}`"
      content-only
      small
    >
      <template v-slot:content>
        <FormGenerator
          :spec="spec"
          :entity="entity"
          :on-submit="submit"
        />
      </template>
    </Page>
  </div>
</template>
<script>
import axios from 'axios'
import _ from 'lodash'
import { mapGetters } from 'vuex'
import permissions from '../../utils/permissions'
import Status from '../../utils/Status'
import Breadcrumbs from '../Breadcrumbs'
import FormGenerator from '../FormGenerator'
import Page from '../Page'
import StatusFlash from '../StatusFlash'

export default {
  name: 'EntityEdit',
  components: {
    StatusFlash, Breadcrumbs, FormGenerator, Page,
  },

  props: {
    config: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      entity: null,
      breadcrumbs: null,
      status: new Status(),
      spec: null,
    }
  },

  computed: {
    entityId() {
      return this.$route.params.id
    },
    ...mapGetters('auth', {
      isAdmin: 'isAdmin',
    }),
  },

  watch: {
    $route: 'fetchData',
  },

  created() {
    this.fetchData()
  },

  methods: {
    async fetchData() {
      try {
        this.status.setPending()

        const requests = [
          this.config.getEntity(this.entityId),
          this.config.getEntitySpec(),
        ]

        const [entity, spec] = await axios.all(requests)

        if (this.isAdmin || permissions.hasWrite(entity.data)) {
          this.entity = this.entityToFormData(entity.data)
          this.breadcrumbs = this.config.createBreadcrumbs(entity.data)
          this.spec = spec.data
          this.status.setDone()
        } else {
          await this.$router.replace(this.config.toUrl(entity.data))
        }
      } catch (error) {
        this.status.setErrorFromResponse(error, 'Unable to get data.')
      }
    },

    entityToFormData(entity) {
      const formData = {}

      const toValue = (value, inArray) => (inArray ? { value } : value)

      const toFormValue = (value, inArray = false) => {
        if (_.has(value, 'uri')) {
          return toValue(value.uri, inArray)
        }
        if (_.isArray(value)) {
          return value.map(v => toFormValue(v, true))
        }
        return toValue(value, inArray)
      }

      Object.entries(entity).forEach(([key, value]) => {
        formData[key] = toFormValue(value)
      })

      return formData
    },

    formDataToEntity(formData) {
      const entity = {}

      const toEntityValue = (value) => {
        if (_.isArray(value)) {
          return value.map(v => v.value)
        }
        return value
      }

      Object.entries(formData).forEach(([key, value]) => {
        entity[key] = toEntityValue(value)
      })

      return entity
    },

    async submit(formData) {
      try {
        const entity = this.formDataToEntity(formData)
        await this.config.putEntity(this.entityId, entity)
        await this.$router.push(this.config.toUrl(this.entity))
      } catch (error) {
        this.status.setError('Unable to update entity data.')
      }
    },
  },
}
</script>
