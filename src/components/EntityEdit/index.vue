<template>
  <div>
    <breadcrumbs
      v-if="entity !== null"
      :links="breadcrumbs"
      current="Edit"
    />
    <status-flash :status="status" />
    <page
      v-if="entity !== null"
      :title="`Edit ${entity.title}`"
      content-only
      small
    >
      <template v-slot:content>
        <form-generator
          :spec="spec"
          :entity="entity"
          :on-submit="submit"
        />
      </template>
    </page>
  </div>
</template>
<script lang="ts">
import axios from 'axios'
import _ from 'lodash'
import {
  Component, Prop, Vue, Watch,
} from 'vue-property-decorator'
import permissions from '../../utils/permissions'
import Status from '../../utils/Status'
import Breadcrumbs from '../Breadcrumbs/index.vue'
import FormGenerator from '../FormGenerator/index.vue'
import Page from '../Page/index.vue'
import StatusFlash from '../StatusFlash/index.vue'

@Component({
  components: {
    Breadcrumbs,
    FormGenerator,
    Page,
    StatusFlash,
  },
})
export default class EntityEdit extends Vue {
  @Prop({ required: true })
  readonly config: any

  entity: any = null

  breadcrumbs: any = null

  status: Status = new Status()

  spec: any = null


  get entityId(): string {
    return this.$route.params.id
  }

  get isAdmin(): boolean {
    return this.$store.getters['auth/isAdmin']
  }

  created(): void {
    this.fetchData()
  }

  @Watch('$route')
  async fetchData(): Promise<void> {
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
  }

  entityToFormData(entity: any): any {
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
  }

  formDataToEntity(formData: any): any {
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
  }

  async submit(formData: any): Promise<void> {
    try {
      const entity = this.formDataToEntity(formData)
      await this.config.putEntity(this.entityId, entity)
      await this.$router.push(this.config.toUrl(this.entity))
    } catch (error) {
      this.status.setError('Unable to update entity data.')
    }
  }
}
</script>
