<template>
  <div>
    <Page
      title="My Metadata"
      content-only
    >
      <template v-slot:content>
        <StatusFlash :status="status" />
        <div
          v-if="dashboard && dashboard.length > 0"
          class="item-list"
        >
          <div
            v-for="catalog in sortByTitle(dashboard)"
            :key="catalog.identifier"
            class="item-list__item"
          >
            <a
              v-if="catalog.datasets.length > 0"
              class="item-list__item__control"
              @click.prevent="toggleOpen(catalog)"
            >
              <fa :icon="['fas', catalog.open ? 'chevron-down' : 'chevron-right']" />
            </a>
            <span
              v-else
              class="item-list__item__control"
            />
            <Avatar
              :initials="catalog.title[0]"
              :value="catalog.identifier"
              smaller
            />
            <div class="item-list__item__content">
              <div class="item-list__item__content__row">
                <router-link :to="`/fdp/catalog/${catalog.identifier}`">
                  {{ catalog.title }}
                </router-link>
              </div>
            </div>
            <div class="item-list__item__actions">
              <MembershipBadge :entity="catalog" />
            </div>

            <div
              v-if="catalog.open"
              class="item-list"
            >
              <div
                v-for="dataset in sortByTitle(catalog.datasets)"
                :key="dataset.identifier"
                class="item-list__item"
              >
                <Avatar
                  :initials="dataset.title[0]"
                  :value="dataset.identifier"
                  smaller
                />
                <div class="item-list__item__content">
                  <div class="item-list__item__content__row">
                    <router-link :to="`/fdp/dataset/${dataset.identifier}`">
                      {{ dataset.title }}
                    </router-link>
                  </div>
                </div>
                <div class="item-list__item__actions">
                  <MembershipBadge :entity="dataset" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="dashboard && dashboard.length === 0">
          <p>
            You have no metadata.
          </p>
        </div>
      </template>
    </Page>
  </div>
</template>
<script>
import _ from 'lodash'
import * as api from '../../api'
import Avatar from '../../components/Avatar'
import Page from '../../components/Page'
import StatusFlash from '../../components/StatusFlash'
import Status from '../../utils/Status'
import MembershipBadge from '../../components/MembershipBadge'

export default {
  name: 'Dashboard',
  components: {
    MembershipBadge, Avatar, StatusFlash, Page,
  },
  data() {
    return {
      dashboard: null,
      status: new Status(),
    }
  },

  watch: {
    $route: 'fetchData',
  },

  created() {
    this.fetchData()
  },

  methods: {
    fetchData() {
      this.status.setPending()

      api.getDashboard()
        .then((response) => {
          this.dashboard = response.data
          this.status.setDone()
        })
        .catch(error => this.status.setErrorFromResponse(error, 'Unable to load dashboard.'))
    },

    toggleOpen(catalog) {
      this.dashboard = this.dashboard.map(c => ({
        ...c,
        open: c.identifier === catalog.identifier ? !c.open : c.open,
      }))
    },

    sortByTitle(list) {
      return _.orderBy(list, ['title'], ['asc'])
    },
  },
}
</script>
