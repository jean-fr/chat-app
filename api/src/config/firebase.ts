// Import the functions you need from the SDKs you need
import * as firebase from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

import * as path from 'path';

// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: 'AIzaSyA3a-o5fmKx_dW3FAZY8kjKH63Q1g38KCs',
//   authDomain: 'chat-app7-7.firebaseapp.com',
//   projectId: 'chat-app7-7',
//   storageBucket: 'chat-app7-7.appspot.com',
//   messagingSenderId: '471652367884',
//   appId: '1:471652367884:web:115dbbccbdbf503850f829',
//   // databaseURL: "https://todo-mobile-app-1e632-default-rtdb.europe-west1.firebasedatabase.app",
// };

// Initialize Firebase

// var admin = require("firebase-admin");

const serviceAccount = path.resolve(
  __dirname,
  'chat-app7-7-firebase-adminsdk-6tyv7-e0358de151.json',
);

let app: firebase.app.App;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL:
      'https://chat-app7-7-default-rtdb.europe-west1.firebasedatabase.app',
  });
} else {
  app = firebase.app();
}

const db = getFirestore(app);

export { db };
