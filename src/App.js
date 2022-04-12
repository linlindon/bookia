import { async } from "@firebase/util";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  getDocs,
  doc,
  collectionGroup,
  query,
  where,
  setDoc,
  collection,
  addDoc,
} from "firebase/firestore";
import Card from "./components/Card";
import SearchBookTitle from "./pages/searchBook";
import Tags from "./pages/tags";

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
// const colRef = collection(db, "users");

// const citiesRef = collection(db, "cities");

// setDoc(doc(citiesRef, "SF"), {
//   name: "San Francisco",
//   state: "CA",
//   country: "USA",
//   capital: false,
//   population: 860000,
//   regions: ["west_coast", "norcal"],
// });
// setDoc(doc(citiesRef, "LA"), {
//   name: "Los Angeles",
//   state: "CA",
//   country: "USA",
//   capital: false,
//   population: 3900000,
//   regions: ["west_coast", "socal"],
// });
// setDoc(doc(citiesRef, "DC"), {
//   name: "Washington, D.C.",
//   state: null,
//   country: "USA",
//   capital: true,
//   population: 680000,
//   regions: ["east_coast"],
// });
// setDoc(doc(citiesRef, "TOK"), {
//   name: "Tokyo",
//   state: null,
//   country: "Japan",
//   capital: true,
//   population: 9000000,
//   regions: ["kanto", "honshu"],
// });
// setDoc(doc(citiesRef, "BJ"), {
//   name: "Beijing",
//   state: null,
//   country: "China",
//   capital: true,
//   population: 21500000,
//   regions: ["jingjinji", "hebei"],
// });

// const q = query(citiesRef, where("country", "==", "china"));
const q = query(collection(db, "cities"), where("capital", "==", true));
// const querySnapshot = getDocs(q);

const citiesRef = collection(db, "cities");
async function test() {
  try {
    await setDoc(doc(citiesRef, "SF", "landmarks"), {
      name: "Golden Gate Bridge",
      type: "bridge",
    });
  } catch (err) {
    console.log("fetch failed", err);
  }
}
test();

console.log("here");

function App() {
  return (
    <>
      {/* <SearchBookTitle />
      <Card /> */}
      <Tags />
    </>
  );
}

export default App;
