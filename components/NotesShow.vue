<template>
  <b-container v-if="!loading" class="mb-3">
    <b-form-row>
      <b-col cols="9">
        <h5>ノート</h5>
        <b-card no-body class="mb-3">
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
                {{ note.latestHistory.title }}
              </h1>
            </b-card-title>

            <div class="mb-3">
              <b-badge
                v-for="(tag, index) in note.latestHistory.tags"
                :key="index"
                class="mr-1"
                variant="success"
                >{{ tag }}</b-badge
              >
            </div>
            <hr />

            <div class="text-muted mb-1 clearfix">
              <span class="float-left">
                <div>
                  作成者:
                  <NuxtLink
                    :to="{ name: 'users-id', params: { id: note.userId } }"
                  >
                    {{
                      findUserById(note.userId)
                        ? findUserById(note.userId).displayName
                        : ''
                    }}
                  </NuxtLink>
                </div>
              </span>
              <span class="float-right">
                <div>作成日: {{ formatDate(note.createdAt) }}</div>
              </span>
            </div>
            <hr />

            <b-card-text>
              <!-- eslint-disable vue/no-v-html -->
              <div
                class="overflow-auto"
                v-html="$md.render(note.latestHistory.content)"
              ></div>
              <!-- eslint-enable -->
            </b-card-text>
          </b-card-body>
        </b-card>

        <h5>コメント</h5>
        <b-list-group class="mb-3">
          <b-list-group-item v-for="comment in comments" :key="comment.id">
            <div>
              <div class="text-muted mb-1">
                <span>
                  <NuxtLink
                    :to="{ name: 'users-id', params: { id: note.userId } }"
                  >
                    {{
                      findUserById(comment.userId)
                        ? findUserById(comment.userId).displayName
                        : ''
                    }}
                  </NuxtLink>
                </span>
                <span class="float-right">{{
                  comment.createdAt ? formatDate(comment.createdAt) : ''
                }}</span>
              </div>
              <div style="white-space: pre-line">{{ comment.content }}</div>
            </div>
          </b-list-group-item>
        </b-list-group>

        <h5>コメント投稿</h5>
        <b-form @submit.prevent="onSubmitComment">
          <b-form-textarea
            v-model="commentContent"
            class="mb-3"
            required
          ></b-form-textarea>
          <b-button type="submit" class="float-right" variant="primary"
            >投稿する</b-button
          >
        </b-form>
      </b-col>

      <b-col cols="3">
        <h5>ノート更新履歴</h5>
        <b-list-group>
          <b-list-group-item
            v-for="history in historiesAfterFirst"
            :key="history.id"
          >
            <div class="cursor-pointer" @click="onClickHistory(history)">
              <div>
                {{
                  findUserById(history.userId)
                    ? findUserById(history.userId).displayName
                    : ''
                }}
              </div>
              <div>
                {{ history.createdAt ? formatDate(history.createdAt) : '' }}
              </div>
            </div>
          </b-list-group-item>
        </b-list-group>
      </b-col>
    </b-form-row>
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
      histories: null,
      commentContent: '',
    }
  },
  firestore() {
    return {
      users: usersRef,
      note: notesRef.doc(this.id),
      comments: notesRef
        .doc(this.id)
        .collection('comments')
        .orderBy('createdAt', 'desc'),
      histories: notesRef
        .doc(this.id)
        .collection('histories')
        .orderBy('createdAt', 'desc'),
    }
  },
  computed: {
    ...mapGetters('auth', ['currentUser']),
    historiesAfterFirst() {
      return this.histories ? [...this.histories].slice(0, -1) : []
    },
    loading() {
      return !(this.users && this.note && this.comments && this.histories)
    },
  },
  methods: {
    findUserById(id) {
      return this.users.find((user) => user.id === id)
    },
    formatDate(timestamp) {
      return dayjs(timestamp.toDate()).format('YYYY/MM/DD HH:mm')
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
    onClickHistory(history) {
      // histories は更新日が新しい順に並んでいる
      const postHistoryIndex = this.histories.findIndex(
        (_history) => _history === history
      )
      const preHistoryIndex = postHistoryIndex + 1
      const post = this.histories[postHistoryIndex].id
      const pre = this.histories[preHistoryIndex].id
      this.$router.push({
        name: 'notes-id-diff',
        params: { id: this.id },
        query: { post, pre },
      })
    },
  },
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
