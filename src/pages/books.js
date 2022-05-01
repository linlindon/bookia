import { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import firebase from "../utils/firebaseTools";
import { UserProfile } from "../App";
import Book from "../components/Book";

const Title = styled.h1`
  text-align: center;
`;

const AddNoteSign = styled.div`
  width: 50px;
  height: 50px;
  font-size: 26px;
  border-radius: 25px;
  border: solid 1px black;
  line-height: 2;
`;

function Books() {
  const [bookDatas, setBookDatas] = useState([]);
  const userId = useContext(UserProfile);

  useEffect(async () => {
    let bookData = [];
    console.log("inside");
    firebase.getBooksData(userId).then((data) => {
      data.forEach((book) => {
        bookData.push(book.data());
      });
      setBookDatas(bookData);
      console.log(bookData);
    });
  }, []);

  // setBookDatas((prev) => [...prev, bookData]);

  return (
    <>
      <Title>筆記書櫃</Title>
      <Book bookDatas={bookDatas} />
      <AddNoteSign>+</AddNoteSign>
    </>
  );
}

export default Books;

// React.useEffect(() => {
//   let noteBookTagsIdArray = [];
//   let noteBookTagsId = [];
//   // let noteBookTagsNameArray = [];
//   async function getNotesData() {
//     try {
//       (await getDocs(booksRef)).forEach((doc) => {
//         bookData.push({
//           title: doc.data().title,
//           author: doc.data().author,
//           publish: doc.data().publish,
//           img: doc.data().img,
//           tags: [],
//         });
//         noteBookTagsId.push({});
//         noteBookTagsIdArray.push(doc.data().tags);
//       });
//       let promiseList = [];
//       noteBookTagsIdArray.map(async (ids, index) => {
//         // 跑兩次
//         let noteBookTagsNameArray = [];
//         await Promise.all(
//           ids.map(async (id) => {
//             // 跑七次
//             const tagDoc = await getDoc(doc(tagsRef, id));
//             noteBookTagsNameArray.push(tagDoc.data().name);
//           })
//         );
//         // console.log(noteBookTagsNameArray);
//         bookData[index].tags.push(...noteBookTagsNameArray);
//         // console.log(bookData);
//       });
//     } catch (err) {
//       console.log("fetch failed", err);
//     }
//     // await Promise.all();
//   }
//   getNotesData();
// }, []);
