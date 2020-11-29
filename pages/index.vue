<template>
  <b-container>
    <h1 class="text-center">Hiden no Tare</h1>
    <b-list-group v-if="notes">
      <b-list-group-item v-for="note in notes" :key="note.id">
        <NuxtLink :to="{ name: 'notes-id', params: { id: note.id } }">
          {{ note.latestNote.title }}
        </NuxtLink>
      </b-list-group-item>
    </b-list-group>
  </b-container>
</template>

<script>
import { notesRef } from '@/plugins/firebase'

export default {
  data() {
    return { notes: null }
  },
  firestore: {
    notes: notesRef,
  },
}
</script>
