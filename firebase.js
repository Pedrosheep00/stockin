//file is used to initialize the firebase app and export the firestore database.
import firebase from 'firebase/app';
import "firebase/firestore";

const firebaseConfig ={
  apiKey: "AIzaSyBaEogYIRsIFEl_2wQq2X7rigAAdpMeIBU",
  authDomain: "stokin-try1.firebaseapp.com",
  projectId: "stokin-try1",
  storageBucket: "stokin-try1.appspot.com",
  messagingSenderId: "202631949178",
  appId: "1:202631949178:web:deff7f7813d608ed1684c3",
  measurementId: "G-TW0PMMJVPK"
};

firebase.initializeApp(firebaseConfig);

export default firebase;