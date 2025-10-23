import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';


// IMPORTANT: Replace with your actual Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDbpC0MddU60cfCwCl8utsMQKfKkU1wpOk",
  authDomain: "tixly-d5417.firebaseapp.com",
  projectId: "tixly-d5417",
  storageBucket: "tixly-d5417.appspot.com",
  messagingSenderId: "481328222321",
  appId: "1:481328222321:web:ff3a3cfd4f31bfa7f60bd0",
  measurementId: "G-1L33QJ3MGM"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Export services
const auth = firebase.auth();
const db = firebase.firestore();

export { auth, db };