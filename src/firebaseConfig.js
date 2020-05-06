import firebase from 'firebase/app'
import 'firebase/firestore';

var firebaseConfig = {
  apiKey: "AIzaSyAVvDagmcBQs5oV_UefyyTJQF8LybZo6-I",
  authDomain: "taboor-ly.firebaseapp.com",
  databaseURL: "https://taboor-ly.firebaseio.com",
  projectId: "taboor-ly",
  storageBucket: "taboor-ly.appspot.com",
  messagingSenderId: "340998177641",
  appId: "1:340998177641:web:bc381fc81fa55e2f60f3f8",
  measurementId: "G-2LJ9SC4MQN"
};
// Initialize Firebase
// firebase.initializeApp(firebaseConfig);
export default firebase.initializeApp(firebaseConfig);

//Enable Offline Mode
firebase.firestore().enablePersistence()
  .catch(function(err) {
      if (err.code == 'failed-precondition') {
        console.log('Multiple tabs open, persistence can only be enabled in one tab at a a time.');
      } else if (err.code == 'unimplemented') {
        console.log('The current browser does not support all of the features required to enable persistence');
      }
  });

window.firebase=firebase;

// export const db = firebase.firestore();


console.log('firebase.initializeApp');
