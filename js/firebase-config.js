import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBXb7ypFRUZkeH_REABRxhjq-LJ0CckcnQ",
  authDomain: "dogdatabase-6121f.firebaseapp.com",
  projectId: "dogdatabase-6121f",
  storageBucket: "dogdatabase-6121f.firebasestorage.app",
  messagingSenderId: "62903158808",
  appId: "1:62903158808:web:9c402287ed0940dc31db6d"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);