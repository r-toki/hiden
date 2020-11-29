<template>
  <b-container v-if="note" class="mb-3">
    <b-row>
      <b-col cols="9">
        <h5>ノート</h5>
        <b-card v-if="canDisplayNote(note)" no-body class="mb-3">
          <template #header>
            <b-icon
              icon="pencil"
              class="float-right cursor-pointer"
              @click="onClickEdit"
            ></b-icon>
          </template>
          <b-card-body>
            <b-card-title>
              <h1>
                {{ note.latestNote.title }}
              </h1>
            </b-card-title>
            <div class="text-muted mb-1 clearfix">
              <span class="float-left">
                <div>作成者: {{ findUserById(note.userId).displayName }}</div>
                <div>
                  最終更新者:
                  {{ findUserById(note.latestNote.userId).displayName }}
                </div>
              </span>
              <span class="float-right">
                <div>作成日: {{ formatDate(note.createdAt) }}</div>
                <div>最終更新日: {{ formatDate(note.updatedAt) }}</div>
              </span>
            </div>
            <b-card-text>
              <!-- eslint-disable vue/no-v-html -->
              <div
                class="overflow-auto"
                v-html="$md.render(note.latestNote.content)"
              ></div>
              <!-- eslint-enable -->
            </b-card-text>
          </b-card-body>
        </b-card>

        <h5>コメント</h5>
        <b-list-group class="mb-3">
          <b-list-group-item v-for="comment in comments" :key="comment.id">
            <div v-if="canDisplayComment(comment)">
              <div class="text-muted mb-1">
                <span>{{ findUserById(comment.userId).displayName }}</span>
                <span class="float-right">{{
                  formatDate(comment.createdAt)
                }}</span>
              </div>
              <div>{{ comment.content }}</div>
            </div>
          </b-list-group-item>
        </b-list-group>

        <h5>コメント投稿</h5>
        <b-form @submit.prevent="onSubmitComment">
          <b-form-textarea
            v-model="commentContent"
            class="mb-3"
          ></b-form-textarea>
          <b-button type="submit" class="float-right" variant="primary"
            >投稿する</b-button
          >
        </b-form>
      </b-col>

      <b-col cols="3">
        <h5>ノート更新履歴</h5>
        <b-list-group>
          <b-list-group-item v-for="pastNote in pastNotes" :key="pastNote.id">
            <div v-if="canDisplayNote(pastNote)" class="cursor-pointer">
              <div>{{ findUserById(pastNote.userId).displayName }}</div>
              <div>{{ formatDate(pastNote.createdAt) }}</div>
            </div>
          </b-list-group-item>
        </b-list-group>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import dayjs from 'dayjs'
import { mapGetters } from 'vuex'
import firebase, { notesRef, usersRef } from '@/plugins/firebase'

export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['id'],
  data() {
    return {
      users: null,
      note: null,
      comments: null,
      pastNotes: null,
      commentContent: '',
    }
  },
  computed: {
    ...mapGetters('auth', ['currentUser']),
  },
  watch: {
    id: {
      immediate: true,
      handler(id) {
        this.$bind('note', notesRef.doc(id))
        this.$bind(
          'comments',
          notesRef.doc(id).collection('comments').orderBy('createdAt', 'asc')
        )
        this.$bind(
          'pastNotes',
          notesRef.doc(id).collection('pastNotes').orderBy('createdAt', 'asc')
        )
      },
    },
  },
  methods: {
    findUserById(id) {
      return this.users.find((user) => user.id === id)
    },
    canDisplayNote(note) {
      return note && this.findUserById(note.userId) && note.createdAt
    },
    formatDate(timestamp) {
      return dayjs(timestamp.toDate()).format('YYYY/MM/DD HH:mm')
    },
    canDisplayComment(comment) {
      return this.findUserById(comment.userId) && comment.createdAt
    },
    onClickEdit() {
      this.$router.push({
        name: 'notes-id-edit',
        params: { id: this.id },
      })
    },
    async onSubmitComment() {
      await notesRef.doc(this.id).collection('comments').add({
        content: this.commentContent,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        userId: this.currentUser.id,
      })
      this.commentContent = ''
    },
  },
  firestore: {
    users: usersRef,
  },
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
