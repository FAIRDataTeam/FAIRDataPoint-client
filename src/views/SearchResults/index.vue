<template>
  <div>
    <page>
      <template #content>
        <status-flash :status="status" />
        <template v-if="results">
          <h2>Search Results for &quot;{{ query }}&quot;</h2>
          <div class="item-list">
            <div
              v-if="results.length === 0"
              class="item-list__empty"
            >
              Nothing was found.
            </div>
            <div
              v-for="item in results"
              :key="item.uri"
              class="item"
            >
              <a
                :href="item.uri"
                target="_blank"
                class="item__title"
              >
                {{ item. title }}
              </a>
              <p
                v-if="item.description"
                class="item__description"
              >
                {{ item.description | truncate }}
              </p>
              <div
                v-if="item.types"
                class="item__tags"
              >
                <a
                  v-for="(type, index) in item.types"
                  :key="index"
                  :href="type"
                  class="item__tags__tag"
                  target="_blank"
                >
                  {{ pathTerm(type) }}
                </a>
              </div>
            </div>
          </div>
        </template>
      </template>
    </page>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import api from '@/api'
import rdfUtils from '@/rdf/utils'
import Page from '@/components/Page/index.vue'
import Status from '@/utils/Status'
import StatusFlash from '@/components/StatusFlash/index.vue'

@Component({ components: { Page, StatusFlash } })
export default class SearchResults extends Vue {
  query: string = null

  status: Status = new Status()

  results: any = null

  created(): void {
    this.init()
  }

  pathTerm(term): string {
    return rdfUtils.pathTerm(term)
  }

  @Watch('$route')
  async init() {
    this.query = this.$route.query.q as string

    try {
      this.status.setPending()
      this.results = null
      const response = await api.search.search({ q: this.query })
      this.results = response.data
      this.status.setDone()
    } catch (error) {
      this.status.setError('Unable to get search results')
    }
  }
}
</script>
