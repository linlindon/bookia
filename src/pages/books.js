import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
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
const HintTitle = styled.h3`
  font-size: 16px;
  margin-top: 5%;
  text-align: center;
`;

// const SignContainer = styled.div`
//   position: fixed;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   right: 5.5%;
//   bottom: 5%;
//   width: 65px;
//   height: 65px;
//   border-radius: 30px;
//   background-color: #ffffff;

//   box-shadow: 2px 3px 7px rgb(0 0 0 / 15%);
//   transition: 0.3s ease;

//   &:hover {
//     transform: translateY(-5px);
//     box-shadow: 0 2px 10px rgba(0 0 0 / 30%);
//   }
// `;
const LinkButton = styled.div`
  border: none;
  width: 150px;
  height: 35px;
  margin-right: 15px;
  letter-spacing: 2px;
  text-align: center;
  margin: 20px;
  padding: 3px 8px;
  font-size: 16px;
  border-radius: 5px;
  color: #fff;
  background-color: ${(props) => (props.active ? "#dca246" : "#e6c88b")};
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 100px;
`;

function Books() {
  const [bookDatas, setBookDatas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isHint, setIsHint] = useState(false);
  const userId = useContext(UserProfile);
  let navigate = useNavigate();

  useEffect(() => {
    let bookData = [];
    setIsLoading(true);
    if (userId) {
      firebase.getBooksData(userId).then((data) => {
        if (data.docs.length === 0) {
          setIsLoading(false);
          setIsHint(true);
        } else {
          data.docs.forEach((book) => {
            bookData.push(book.data());
            console.log("else");
          });
          setIsLoading(false);
          setBookDatas(bookData);
        }
        console.log(bookData);
      });
    }
  }, [userId]);

  // setBookDatas((prev) => [...prev, bookData]);

  return (
    <Wrapper>
      <Title>我的書櫃</Title>
      {isLoading && (
        <LoadingContainer>
          <Loading />
        </LoadingContainer>
      )}
      {isHint && (
        <>
          <HintTitle>尚無書本</HintTitle>
          <LinkButton onClick={() => navigate(`/search`)}>
            前往圖書館新增書籍
          </LinkButton>
        </>
      )}
      {bookDatas.length !== 0 && <Book bookDatas={bookDatas} />}
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
