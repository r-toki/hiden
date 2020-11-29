<template>
  <b-container v-if="note" class="h-100 pb-3 d-flex flex-column">
    <NuxtLink
      :to="{ name: 'notes-id', params: { id } }"
      class="align-self-start"
      >戻る</NuxtLink
    >
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
      <b-form-tags
        v-model="tags"
        placeholder="Tag"
        tag-variant="success"
        class="mb-3"
      ></b-form-tags>
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
          variant="primary"
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
      tags: [],
    }
  },
  firestore() {
    return {
      note: notesRef.doc(this.id),
    }
  },
  computed: {
    ...mapGetters('auth', ['currentUser']),
    hasDifference() {
      // すごい長い。title, content, tags に差分があるかを評価
      return this.note
        ? this.note.latestHistory.title !== this.title ||
            this.note.latestHistory.content !== this.content ||
            JSON.stringify([...this.note.latestHistory.tags].sort()) !==
              JSON.stringify([...this.tags].sort())
        : true
    },
  },
  watch: {
    note(newVal, oldVal) {
      // title と content の初期化処理。note が bind された後に一回だけ実行したい
      if (!oldVal && newVal) {
        this.title = newVal.latestHistory.title
        this.content = newVal.latestHistory.content
        this.tags = [...newVal.latestHistory.tags]
      }
    },
  },
  methods: {
    async onClickUpdate() {
      const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp()
      const latestHistory = {
        title: this.title,
        content: this.content,
        tags: this.tags.sort(),
        createdAt: serverTimestamp,
        userId: this.currentUser.id,
      }
      await this.$firestoreRefs.note.update({
        latestHistory,
        updatedAt: serverTimestamp,
      })
      await this.$firestoreRefs.note
        .collection('histories')
        .add({ ...latestHistory })
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
