<template>
  <b-container style="max-width: 720px">
    <h1 class="text-center">Hiden no Tare</h1>
    <b-list-group v-if="notes">
      <b-list-group-item v-for="note in notes" :key="note.id">
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
  </b-container>
</template>

<script>
import dayjs from 'dayjs'
import { notesRef, usersRef } from '@/plugins/firebase'

export default {
  data() {
    return { notes: null, users: null }
  },
  firestore: {
    notes: notesRef.orderBy('updatedAt', 'desc'),
    users: usersRef,
  },
  methods: {
    formatDate(timestamp) {
      return dayjs(timestamp.toDate()).format('YYYY/MM/DD HH:mm')
    },
  },
}
</script>
