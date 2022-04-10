import { initializeApp } from "firebase/app";
import { getFirestore, doc } from "firebase/firestore";
import { collection, addDoc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBM3IamCWyJi_8vyVPP34KUixJJKXlAwQ8",
  authDomain: "bookia-280d8.firebaseapp.com",
  projectId: "bookia-280d8",
  storageBucket: "bookia-280d8.appspot.com",
  messagingSenderId: "330107513484",
  appId: "1:330107513484:web:b81b9e8f3748a595dd69a9",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

setDoc(doc(db, "cities", "LA"), {
  name: "Los Angeles",
  state: "CA",
  country: "USA",
});

function App() {
  return (
    <div>
      <h2>Let's get started!</h2>
    </div>
  );
}

export default App;
