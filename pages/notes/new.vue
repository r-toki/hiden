<template>
  <b-container class="mb-3 d-flex flex-column">
    <h2 class="text-center">ノート新規作成</h2>
    <b-form
      class="flex-fill d-flex flex-column"
      @submit.prevent="onClickPostButton"
    >
      <b-form-input
        v-model="title"
        placeholder="Title"
        required
        class="mb-3"
      ></b-form-input>
      <b-row class="flex-fill">
        <b-col class="pr-0">
          <b-form-textarea
            v-model="content"
            class="h-100"
            placeholder="Content"
          ></b-form-textarea>
        </b-col>
        <b-col class="pl-0 h-100">
          <!-- eslint-disable vue/no-v-html -->
          <div
            class="preview py-2 px-2 mr-3 border rounded"
            v-html="$md.render(content)"
          ></div>
          <!-- eslint-enable -->
        </b-col>
      </b-row>
      <div>
        <b-button type="submit" variant="success" class="mt-2 float-right"
          >投稿する</b-button
        >
      </div>
    </b-form>
  </b-container>
</template>

<script>
import { mapGetters } from 'vuex'
import firebase, { notesRef } from '@/plugins/firebase'

export default {
  data() {
    return { title: '', content: '' }
  },
  computed: {
    ...mapGetters('auth', ['currentUser']),
  },
  methods: {
    async onClickPostButton() {
      const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp()
      const latestHistory = {
        title: this.title,
        content: this.content,
        createdAt: serverTimestamp,
        userId: this.currentUser.id,
      }
      const { id } = await notesRef.add({
        createdAt: serverTimestamp,
        updatedAt: serverTimestamp,
        userId: this.currentUser.id,
        latestHistory,
      })
      await notesRef
        .doc(id)
        .collection('histories')
        .add({ ...latestHistory })
      this.$router.push({ name: 'notes-id', params: { id } })
    },
  },
}
</script>

<style scoped>
.preview {
  overflow: auto;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}
</style>
