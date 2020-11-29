import firebase from '@/plugins/firebase'
const provider = new firebase.auth.GoogleAuthProvider()

const state = () => ({
  currentUser: null,
})

const getters = {
  currentUser: (s) => s.currentUser,
  isLoggedIn: (s) => s.currentUser !== null,
}

const mutations = {
  SET_CURRENT_USER: (s, user) => {
    s.currentUser = user
  },
}

const actions = {
  setCurrentUser: (context, currentUser) => {
    context.commit('SET_CURRENT_USER', currentUser)
  },
  signIn: (_) => {
    return firebase.auth().signInWithPopup(provider)
  },
  signOut: (_) => {
    return firebase.auth().signOut()
  },
}

export { state, getters, mutations, actions }
