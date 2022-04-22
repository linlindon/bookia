import { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { getDocs } from "firebase/firestore";
import { booksRef } from "../utils/fireBaseConfig";
import uniqid from "uniqid";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
`;
const Title = styled.h1``;

const NoteBox = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  width: 60%;
  margin-bottom: 20px;
  border: 2px solid #ece6e6;
  border-radius: 10px;
`;

const BookImg = styled.div`
  width: 120px;
  background-color: #66b2ff;
`;
const Img = styled.img`
  width: 100%;
  object-fit: cover;
`;
const ContentContainer = styled.div`
  width: 80%;
  padding: 20px;
`;

const BookTitle = styled.h3``;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1em;
`;
const Tag = styled.p`
  padding: 4px 6px;
  font-size: 14px;
  border: 1px solid #ffb226;
  border-radius: 5px;
`;
const AddNoteSign = styled.div`
  width: 50px;
  height: 50px;
  font-size: 26px;
  border-radius: 25px;
  border: solid 1px black;
  line-height: 2;
`;

function Notes() {
  const [bookDatas, setBookDatas] = useState([]);

  useEffect(async () => {
    let bookData = [];
    (await getDocs(booksRef)).forEach((book) => {
      bookData.push(book.data());
    });
    setBookDatas(bookData);
  }, []);

  let navigate = useNavigate();
  function redirectBookPage(id) {
    navigate(`/booknote/${id}`);
  }
  // setBookDatas((prev) => [...prev, bookData]);

  return (
    <>
      <Title>筆記櫃</Title>
      {bookDatas?.map((book) => (
        <Container onClick={() => redirectBookPage(book.id)} key={uniqid()}>
          <NoteBox key={uniqid()}>
            <BookImg key={uniqid()}>
              <Img key={uniqid()} src={book.img} alt="" />
            </BookImg>
            <ContentContainer key={uniqid()}>
              <BookTitle key={uniqid()}>書名: {book.title}</BookTitle>
              <TagsContainer key={uniqid()}>
                {book.tagNames.map((tag) => (
                  <Tag key={uniqid()}>{tag}</Tag>
                ))}
              </TagsContainer>
            </ContentContainer>
          </NoteBox>
        </Container>
      ))}
      <AddNoteSign>+</AddNoteSign>
    </>
  );
}

export default Notes;

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
