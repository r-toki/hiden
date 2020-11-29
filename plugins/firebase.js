import firebase from 'firebase'

const firebaseConfig = {
  apiKey: 'AIzaSyAFmOvK0A6RBzWNKpV5yYjoaayPyjHCutU',
  authDomain: 'hiden-2e12a.firebaseapp.com',
  databaseURL: 'https://hiden-2e12a.firebaseio.com',
  projectId: 'hiden-2e12a',
  storageBucket: 'hiden-2e12a.appspot.com',
  messagingSenderId: '912258761115',
  appId: '1:912258761115:web:d5886b44d8fc29be17a13e',
  measurementId: 'G-GES8S1BNTC',
}

firebase.initializeApp(firebaseConfig)

const db = firebase.firestore()
const usersRef = db.collection('users')
const notesRef = db.collection('notes')

export default firebase
export { usersRef, notesRef }
