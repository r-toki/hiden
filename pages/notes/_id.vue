<template>
  <div>
    <NotesShow v-if="isShowPage" :id="id" />
    <NuxtChild :id="id" />
  </div>
</template>

<script>
import NotesShow from '@/components/NotesShow'

export default {
  components: { NotesShow },
  computed: {
    isShowPage() {
      return this.$route.name === 'notes-id'
    },
    id() {
      return this.$route.params.id
    },
  },
}
</script>
