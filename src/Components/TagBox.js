import React from "react";
import styled from "styled-components";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  getDocs,
  collection,
  doc,
  getDoc,
  query,
  where,
  setDoc,
} from "firebase/firestore";
import { tagsRef, notesRef, tagGroupsRef } from "../utils/fireBaseConfig";

const TagBoxContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 60%;
  margin-bottom: 30px;
  border: 1px solid #ece6e6;
  border-radius: 10px;
`;

const BoxName = styled.h4`
  width: 80%;
  padding-bottom: 10px;
  text-align: center;
  font-size: 16px;
  border-bottom: 2px solid #ece6e6;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 80%;
  gap: 1em;
`;
const Label = styled.label``;
const Input = styled.input.attrs({ type: "checkbox" })`
  display: none;
`;

const Tag = styled.div`
  padding: 4px 6px;
  font-size: 14px;
  border: 1px solid #ffb226;
  border-radius: 5px;
  ${Input}:checked + && {
    background-color: #ffb226;
  }
`;

const AddSign = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  border: solid 1px black;
  line-height: 2.5;
`;

const Wrapper = styled.div`
  position: relative;
`;

const AddTagBox = styled.div`
  position: absolute;
  top: -600px;
  width: 150px;
  height: 60px;
  border: solid black 1px;
  border-radius: 10px;
  background-color: #ffffff;
  z-index: 9;
`;

const TagInput = styled.input`
  margin: 5%;
`;

const AddTagButton = styled.button`
  margin-left: 70%;
`;
const CloseTagInput = styled.span`
  font-size: 16px;
`;
const NoteBox = styled(TagBox)`
  margin-top: 30px;
`;
const BookName = styled.div`
  display: block;
  margin-bottom: 5px;
`;

let clickTagNameArray = [];
function TagBox(props) {
  const [showTagInput, setShowTagInput] = React.useState(false);
  const [inputTagName, setInputTagName] = React.useState("");
  const [tagBoxId, getTagBoxId] = React.useState("");
  const [notesBox, setNotesBoxData] = React.useState([]);
  const [changeTagStyle, setChagneTagStyle] = React.useState(false);

  function showTagHandler(boxId) {
    console.log(boxId);
    getTagBoxId(boxId);
    setShowTagInput(true);
  }

  function inputTagHandler(e) {
    setInputTagName(e);
  }
  async function addTagHandler() {
    if (!inputTagName) {
      alert("請輸入標籤名稱");
    } else {
      const setTagsRef = doc(tagsRef);
      await setDoc(setTagsRef, {
        name: inputTagName,
        tagID: setTagsRef.id,
        tagGroupID: tagBoxId,
      });
      setShowTagInput(false);

      const newDatas = props.data.map((item) => {
        if (item.id === tagBoxId) {
          item.tags.push(inputTagName);
        }
        return { ...item, tags: [...item.tags] };
      });
      props.setboxDatas(newDatas);
    }
  }
  function closeInputTagHandler() {
    setShowTagInput(false);
  }

  async function choseTagHandler(tagName, id) {
    console.log(tagName);
    clickTagNameArray.push(tagName);
    console.log(clickTagNameArray);

    let notesData = [];
    let tagIdArray;

    // 用tag name取得該tag的ID, assign到 clickTagIdArray
    const q = query(tagsRef, where("name", "==", tagName));
    const tagData = await getDocs(q);
    let clickTagIdArray = tagData.docs.map((item) => {
      return item.data().tagID;
    });

    await Promise.all(
      // 用tag ID array取得有那個標籤的note
      clickTagIdArray.map(async (i) => {
        const tagNameQuery = query(
          notesRef,
          where("tags", "array-contains", i)
        );
        const notes = await getDocs(tagNameQuery);

        // 把note內容塞到要render 畫面的data裡
        notes.forEach((note) => {
          // console.log(item.data().tags);
          notesData.push({
            title: note.data().title,
            bookName: note.data().bookTitle,
            content: note.data().content,
            tags: [],
          });
          // 取得那個note擁有的 tag id 塞到array
          tagIdArray = note.data().tags;

          tagIdArray.map(async (id) => {
            // 筆記裡面的id array
            console.log("該筆記裡面有的tags id===", id);
            const tagQuery = query(tagsRef, where("tagID", "==", id));
            const tagDocs = await getDocs(tagQuery);
            let notesDataIndex = 0;
            tagDocs.forEach((tagItem) => {
              // for each note data，把tag 塞進去
              console.log("該筆記裡面有的標籤中文版===", tagItem.data().name);
              notesData[notesDataIndex].tags.push(tagItem.data().name);
              // console.log(notesData);
            });
            notesDataIndex += 1;
            console.log("該筆記資料包===", notesData);
          });
        });
      })
    );
    setNotesBoxData(notesData);
    console.log(notesBox);
  }

  // React.useEffect(() => {
  //   let newArray = [];
  //   for (let i = 0; i < props.data.length; i++) {
  //     let a = 100;
  //     newArray.push(a);
  //   }
  //   setChagne(newArray);
  // }, [props.data]);

  // const changeIndex = function (boxIndex, index) {
  //   console.log(boxIndex, index);
  //   change[boxIndex] = index;
  //   setChagne([...change]);
  // };

  return (
    <>
      {props.data?.map((box, boxIndex) => (
        <TagBoxContainer key={box.id}>
          <BoxName>{box.title}</BoxName>
          <TagsContainer>
            {box.tags &&
              box.tags.map((tag, index) => (
                <Label name={tag}>
                  <Input id={tag}></Input>
                  <Tag onClick={() => choseTagHandler(tag)} key={index}>
                    {tag}
                  </Tag>
                </Label>
              ))}
          </TagsContainer>
          <AddSign onClick={() => showTagHandler(box.id)}>新增</AddSign>
        </TagBoxContainer>
      ))}
      {showTagInput && (
        <Wrapper>
          <AddTagBox>
            <TagInput
              onChange={(e) => inputTagHandler(e.target.value)}
              placeholder="新增標籤"
            ></TagInput>
            <CloseTagInput onClick={closeInputTagHandler}>x</CloseTagInput>
            <AddTagButton onClick={addTagHandler}>新增</AddTagButton>
          </AddTagBox>
        </Wrapper>
      )}
      {notesBox &&
        notesBox.map((note) => (
          <NoteBox>
            <BoxName>{note.title}</BoxName>
            <BookName>{note.bookName}</BookName>
            <TagsContainer>
              {note.tags.map((tag) => (
                <Tag>
                  {tag}
                  <deleteSign>x</deleteSign>
                </Tag>
              ))}
              <p>{note.content}</p>
              <AddSign>修改</AddSign>
            </TagsContainer>
          </NoteBox>
        ))}
    </>
  );
}

export default TagBox;
