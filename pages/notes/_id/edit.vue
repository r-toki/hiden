<template>
  <b-container v-if="note" class="h-100 pb-3 d-flex flex-column">
    <h2 class="text-center">ノート更新</h2>
    <b-form
      class="flex-fill d-flex flex-column"
      @submit.prevent="onClickUpdate"
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
        <b-button
          type="submit"
          variant="success"
          class="mt-2 float-right"
          :disabled="!hasDifference"
          >更新する</b-button
        >
      </div>
    </b-form>
  </b-container>
</template>

<script>
import { mapGetters } from 'vuex'
import firebase, { notesRef } from '@/plugins/firebase'

export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['id'],
  data() {
    return {
      note: null,
      title: '',
      content: '',
    }
  },
  computed: {
    ...mapGetters('auth', ['currentUser']),
    hasDifference() {
      return this.note
        ? this.note.latestNote.title !== this.title ||
            this.note.latestNote.content !== this.content
        : true
    },
  },
  watch: {
    // ドキュメントの bind 方法はこれが正しいの？公式にはこう書いてあったけど
    id: {
      immediate: true,
      handler(id) {
        this.$bind('note', notesRef.doc(id))
      },
    },
    note(newVal, oldVal) {
      // title と content の初期化処理。note が bind された後に一回だけ実行したい
      if (!oldVal && newVal) {
        this.title = newVal.latestNote.title
        this.content = newVal.latestNote.content
      }
    },
  },
  methods: {
    async onClickUpdate() {
      const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp()
      const latestNote = {
        title: this.title,
        content: this.content,
        createdAt: serverTimestamp,
        userId: this.currentUser.id,
      }
      await this.$firestoreRefs.note.update({
        latestNote,
        updatedAt: serverTimestamp,
      })
      await this.$firestoreRefs.note
        .collection('pastNotes')
        .add({ ...latestNote })
      this.$router.push({ name: 'notes-id', params: { id: this.id } })
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
