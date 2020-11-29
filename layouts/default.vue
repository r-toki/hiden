<template>
  <div class="h-100 d-flex flex-column">
    <TheHeader />
    <Nuxt v-if="isLoggedIn" class="flex-fill" />
    <h1 v-else class="text-center">Hiden no Tare</h1>
  </div>
</template>

<script>
import firebase, { usersRef } from '@/plugins/firebase'
import { mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapGetters('auth', ['isLoggedIn']),
  },
  created() {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        const { uid, displayName } = user
        await usersRef.doc(uid).set({ displayName })
        await this.setCurrentUser({ id: uid, displayName })
      } else {
        await this.setCurrentUser(null)
        this.$router.push('/')
      }
    })
  },
  methods: {
    ...mapActions('auth', ['setCurrentUser']),
  },
}
</script>

<style>
html,
body,
#__nuxt,
#__layout {
  height: 100%;
}
</style>
