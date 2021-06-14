import firebase from "firebase/app"
import "firebase/firestore"
import "firebase/storage"
import "firebase/auth"

const app = firebase.initializeApp({
  apiKey: "AIzaSyC_deu2hHu7zv5j5O08mBvCEVJc1KOjUNw",
  authDomain: "acttohire.firebaseapp.com",
  projectId: "acttohire",
  storageBucket: "acttohire.appspot.com",
  messagingSenderId: "994032242386",
  appId: "1:994032242386:web:31740bb14a37eef15ea70b",
  measurementId: "G-BEHDSWSY6R"
})

export const auth = app.auth()
export const db = firebase.firestore();
export var provider = new firebase.auth.GoogleAuthProvider();
export const firebasevalue = firebase.firestore.FieldValue;
export const storageRef = firebase.storage().ref();
export const timestamp = firebase.firestore.FieldValue.serverTimestamp()
export default app