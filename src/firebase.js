import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

//  web app's Firebase configuration
const firebaseConfig ={
  apiKey: "AIzaSyBaEogYIRsIFEl_2wQq2X7rigAAdpMeIBU",
  authDomain: "stokin-try1.firebaseapp.com",
  projectId: "stokin-try1",
  storageBucket: "stokin-try1.appspot.com",
  messagingSenderId: "202631949178",
  appId: "1:202631949178:web:deff7f7813d608ed1684c3",
  measurementId: "G-TW0PMMJVPK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

const auth = getAuth(app); // initialize auth

const storage = getStorage(app); // initialize storage

export default app;
export { firestore, auth, storage, signOut };
