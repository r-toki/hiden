<template>
  <b-container v-if="user" style="max-width: 720px">
    <h1 class="text-center">{{ user.displayName }}</h1>
    <h5>作成したノート</h5>
    <b-list-group>
      <b-list-group-item v-for="note in notesCreatedByUser" :key="note.id">
        <NuxtLink :to="{ name: 'notes-id', params: { id: note.id } }">
          <h5>{{ note.latestHistory.title }}</h5>
        </NuxtLink>
        <div class="text-muted">
          <div>
            作成日: {{ note.createdAt ? formatDate(note.createdAt) : '' }}
          </div>
        </div>
      </b-list-group-item>
    </b-list-group>
  </b-container>
</template>

<script>
import dayjs from 'dayjs'
import { notesRef, usersRef } from '@/plugins/firebase'

export default {
  data() {
    return { user: null, notesCreatedByUser: null }
  },
  firestore() {
    return {
      user: usersRef.doc(this.id),
      notesCreatedByUser: notesRef
        .where('userId', '==', this.id)
        .orderBy('createdAt', 'desc'),
    }
  },
  computed: {
    id() {
      return this.$route.params.id
    },
  },
  methods: {
    formatDate(timestamp) {
      return dayjs(timestamp.toDate()).format('YYYY/MM/DD HH:mm')
    },
  },
}
</script>
