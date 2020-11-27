<template>
  <div>
    <b-container v-if="isShowPage">
      <b-card v-if="note" no-body class="mb-3">
        <template #header>
          <b-icon
            icon="pencil"
            class="float-right pencil-icon"
            @click="onClickEdit"
          ></b-icon>
        </template>
        <b-card-body>
          <b-card-title>
            {{ note.latestNote.title }}
          </b-card-title>
          <b-card-text>
            <div v-html="$md.render(note.latestNote.content)"></div>
          </b-card-text>
        </b-card-body>
      </b-card>
    </b-container>
    <NuxtChild />
  </div>
</template>

<script>
import { notesRef } from '@/plugins/firebase'

export default {
  data() {
    return { note: null }
  },
  computed: {
    id() {
      return this.$route.params.id
    },
    isShowPage() {
      return this.$route.name === 'notes-id'
    },
  },
  watch: {
    id: {
      immediate: true,
      handler(id) {
        this.$bind('note', notesRef.doc(id))
      },
    },
  },
  methods: {
    onClickEdit() {
      this.$router.push({
        name: 'notes-id-edit',
        params: { id: this.id },
      })
    },
  },
}
</script>

<style scoped>
.pencil-icon {
  cursor: pointer;
}
</style>
