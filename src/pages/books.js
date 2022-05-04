import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { BookAdd } from "@styled-icons/fluentui-system-filled/BookAdd";
import firebase from "../utils/firebaseTools";
import { UserProfile } from "../App";
import Book from "../components/Book";
import Loading from "../components/Loading";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-wrap: wrap;
`;

const Title = styled.h1`
  text-align: center;
`;
const SignContainer = styled.div`
  position: fixed;
  right: 5.5%;
  bottom: 4%;
  width: 65px;
  height: 65px;
  border-radius: 30px;
  background-color: #ffffff;
  box-shadow: 2px 3px 7px rgb(0 0 0 / 15%);
`;
const LoadingContainer = styled.div`
  margin-top: 100px;
`;
const AddNoteSign = styled(BookAdd)`
  position: fixed;
  right: 6%;
  bottom: 5%;
  width: 50px;
  color: #3fccdc;
  cursor: pointer;
`;

function Books() {
  const [bookDatas, setBookDatas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const userId = useContext(UserProfile);
  let navigate = useNavigate();

  useEffect(async () => {
    let bookData = [];
    setIsLoading(true);
    firebase.getBooksData(userId).then((data) => {
      data.forEach((book) => {
        bookData.push(book.data());
      });
      setBookDatas(bookData);
      console.log(bookData);
    });
    setIsLoading(false);
  }, []);

  // setBookDatas((prev) => [...prev, bookData]);

  return (
    <Wrapper>
      <Title>筆記書櫃</Title>
      {isLoading && (
        <LoadingContainer>
          <Loading />
        </LoadingContainer>
      )}
      <Book bookDatas={bookDatas} />
      <SignContainer>
        <AddNoteSign onClick={() => navigate(`/search`)} title="新增書籍" />
      </SignContainer>
    </Wrapper>
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
