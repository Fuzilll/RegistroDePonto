import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-storage.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js";

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCCAmx_AKf8a6I5IXJRxG7SGs-4ZvU28n4",
    authDomain: "registrodepontop.firebaseapp.com",
    databaseURL: "https://registrodepontop-default-rtdb.firebaseio.com",
    projectId: "registrodepontop",
    storageBucket: "registrodepontop.appspot.com",
    messagingSenderId: "756196331980",
    appId: "1:756196331980:web:cf695d748fb65d67c80d69"
};

// Inicializar o Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const storage = getStorage(app);
const database = getDatabase(app);
const auth = getAuth(app);

export { app, firestore, storage, database, auth };
