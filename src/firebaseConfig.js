import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyARja7BlOukccjL9YIpMFeGjqVvADa-A2Q",
  authDomain: "testreactnativestudio.firebaseapp.com",
  projectId: "testreactnativestudio",
  storageBucket: "testreactnativestudio.firebasestorage.app",
  messagingSenderId: "626494768463",
  appId: "1:626494768463:web:07bcfa32b560b18770f13a",
  measurementId: "G-QWM3E269EV"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Imposta la persistenza per salvare la sessione a livello locale
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log('Persistenza sessione impostata su locale');
  })
  .catch((error) => {
    console.error('Errore nella persistenza:', error);
  });

export { auth, db };
