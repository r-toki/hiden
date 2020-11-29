<template>
  <b-container v-if="users && postHistory && preHistory" class="mb-3">
    <NuxtLink :to="{ name: 'notes-id', params: { id } }">戻る</NuxtLink>
    <h1 class="text-center">ノート更新履歴</h1>
    <b-card>
      <div class="text-muted mb-3">
        <div>
          更新者:
          <NuxtLink
            :to="{ name: 'users-id', params: { id: postHistory.userId } }"
          >
            {{
              findUserById(postHistory.userId)
                ? findUserById(postHistory.userId).displayName
                : ''
            }}
          </NuxtLink>
        </div>
        <div>
          更新日:
          {{ postHistory.createdAt ? formatDate(postHistory.createdAt) : '' }}
        </div>
      </div>

      <h5 class="text-muted">Title</h5>
      <div v-for="(part, index) in diffTitle" :key="index">
        <div :class="{ added: part.added, removed: part.removed }">
          <h1 style="white-space: pre-line">{{ part.value }}</h1>
        </div>
      </div>
      <hr />

      <h5 class="text-muted">Tags</h5>
      <span v-for="(preTag, index) in preHistory.tags" :key="index">
        <b-badge
          class="mr-1"
          :variant="postHistory.tags.includes(preTag) ? 'secondary' : 'danger'"
        >
          {{ preTag }}
        </b-badge>
      </span>
      <br />
      <span v-for="(postTag, index) in postHistory.tags" :key="index">
        <b-badge
          class="mr-1"
          :variant="preHistory.tags.includes(postTag) ? 'secondary' : 'primary'"
        >
          {{ postTag }}
        </b-badge>
      </span>
      <hr />

      <h5 class="text-muted">Content</h5>
      <div v-for="(part, index) in diffContent" :key="index">
        <div :class="{ added: part.added, removed: part.removed }">
          <div style="white-space: pre-line">{{ part.value }}</div>
        </div>
      </div>
    </b-card>
  </b-container>
</template>

<script>
import { usersRef, notesRef } from '@/plugins/firebase'
import dayjs from 'dayjs'
const Diff = require('diff')

export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['id'],
  data() {
    return {
      users: null,
      postHistory: null,
      preHistory: null,
    }
  },
  firestore() {
    return {
      users: usersRef,
      postHistory: notesRef
        .doc(this.id)
        .collection('histories')
        .doc(this.postHistoryId),
      preHistory: notesRef
        .doc(this.id)
        .collection('histories')
        .doc(this.preHistoryId),
    }
  },
  computed: {
    postHistoryId() {
      return this.$route.query.post
    },
    preHistoryId() {
      return this.$route.query.pre
    },
    diffTitle() {
      return Diff.diffLines(this.preHistory.title, this.postHistory.title)
    },
    diffContent() {
      return Diff.diffLines(this.preHistory.content, this.postHistory.content)
    },
  },
  methods: {
    findUserById(id) {
      return this.users.find((user) => user.id === id)
    },
    formatDate(timestamp) {
      return dayjs(timestamp.toDate()).format('YYYY/MM/DD HH:mm')
    },
  },
}
</script>

<style scoped>
.added {
  background-color: #e6ffed;
}
.removed {
  background-color: #ffdce0;
}
</style>
