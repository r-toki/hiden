<template>
  <b-container style="max-width: 720px">
    <h1 class="text-center">Hiden no Tare</h1>
    <div v-if="notes">
      <div class="mb-5">
        <h3>タグ</h3>
        <b-button
          v-for="(tag, index) in tags(notes)"
          :key="index"
          :variant="tag === activeTag ? 'success' : 'secondary'"
          class="mr-2"
          @click="onClickTag(tag)"
        >
          {{ tag }}
        </b-button>
      </div>

      <h3>ノート一覧</h3>
      <b-list-group>
        <b-list-group-item
          v-for="note in activeTag ? notesFilterByTag : notes"
          :key="note.id"
        >
          <NuxtLink :to="{ name: 'notes-id', params: { id: note.id } }">
            <h5>{{ note.latestHistory.title }}</h5>
          </NuxtLink>
          <div class="text-muted">
            <div>
              更新日: {{ note.updatedAt ? formatDate(note.updatedAt) : '' }}
            </div>
          </div>
        </b-list-group-item>
      </b-list-group>
    </div>
  </b-container>
</template>

<script>
import dayjs from 'dayjs'
import { notesRef, usersRef } from '@/plugins/firebase'

export default {
  data() {
    return { notes: null, users: null, notesFilterByTag: null }
  },
  firestore: {
    notes: notesRef.orderBy('updatedAt', 'desc'),
    users: usersRef,
  },
  computed: {
    activeTag() {
      return this.$route.query.tag ? this.$route.query.tag : null
    },
  },
  watch: {
    activeTag: {
      immediate: true,
      handler(activeTag) {
        this.$bind(
          'notesFilterByTag',
          notesRef
            .where('latestHistory.tags', 'array-contains', activeTag)
            .orderBy('updatedAt', 'desc')
        )
      },
    },
  },
  methods: {
    tags(notes) {
      // 連結して、重複取り除いて、ソートする
      return notes
        .reduce((a, b) => a.concat(b.latestHistory.tags), [])
        .filter((x, i, self) => self.indexOf(x) === i)
        .sort()
    },
    onClickTag(tag) {
      if (tag === this.activeTag) {
        this.$router.push({ name: 'index' })
        return
      }
      this.$router.push({ name: 'index', query: { tag } })
    },
    formatDate(timestamp) {
      return dayjs(timestamp.toDate()).format('YYYY/MM/DD HH:mm')
    },
  },
}
</script>
