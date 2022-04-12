// init firebase app
const app = initializeApp(firebaseConfig);

// init services, db represents our database connection
const db = getFirestore(app);

// collection ref
const colRef = collection(db, "users");

// get collection data
// getDocs是promise，所以後面一定要.then or async func才能接到資料
getDocs(colRef)
  .then((snapshot) => {
    let users = [];
    // doc.id可以拿到隨機id
    snapshot.docs.forEach((doc) => {
      users.push({ ...doc.data(), id: doc.id });
      // log出來array包含objects。裡面是每個user的key-value。
      console.log(users);
    });
  })
  .catch((err) => {
    console.log(err.message);
  });

// use where() to query for all of the documents that meet a certain condition,
// then use get() to retrieve the results
// 結構: cities > DC(城市縮寫) > profile(capital:true)
const q = query(collection(db, "cities"), where("capital", "==", true));
async function test(qDoc) {
  try {
    const querySnapshot = await getDocs(qDoc);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });
  } catch (err) {
    console.log("fetch failed", err);
  }
}
test(q);

// 修改或新增(如果要修改，但裡面不變動的東西也要再複製上去)
const citiesRef = collection(db, "cities");
async function test() {
  try {
    setDoc(doc(citiesRef, "LA"), {
      name: "Los Angeles",
      country: "CHA",
    });
  } catch (err) {
    console.log("fetch failed", err);
  }
}
test();

// 新增第二個參數 { merge: true }，可以保留原來的資料新增進去
try {
  setDoc(doc(citiesRef, "LA"), { test: "Los" }, { merge: true });
} catch (err) {
  console.log("fetch failed", err);
}
