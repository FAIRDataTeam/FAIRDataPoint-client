<template>
  <base-prism-editor
    v-bind="attrs"
    :language="language"
    :highlight="highlight"
  />
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { PrismEditor as BasePrismEditor } from 'vue-prism-editor'
import Prism from 'prismjs'

export default defineComponent({
  name: 'PrismEditor',
  components: {
    BasePrismEditor,
  },
  inheritAttrs: false,
  props: {
    language: {
      type: String,
      default: 'markup',
    },
  },
  setup(props, { attrs }) {
    const highlight = (code: string) => {
      const lang = props.language || 'markup'
      const languages = (Prism as any).languages || {}
      const grammar = languages[lang] || languages.markup
      return Prism.highlight(code, grammar, lang)
    }

    return {
      attrs,
      highlight,
    }
  },
})
</script>
