import styled from "styled-components";
import React from "react";
import TagBox from "../components/TagBox";
import { tagsRef, tagGroupsRef } from "../utils/fireBaseConfig";
import {
  setDoc,
  getFirestore,
  getDocs,
  collection,
  doc,
  getDoc,
  query,
  where,
} from "firebase/firestore";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
`;

const Wrapper = styled.div`
  position: relative;
`;
const AddBoxSign = styled.div`
  width: 50px;
  height: 50px;
  font-size: 26px;
  border-radius: 25px;
  border: solid 1px black;
  line-height: 2;
`;
const InputBox = styled.div`
  position: absolute;
  top: -150px;
  width: 50%;
  height: 200px;
  border: solid black 1px;
  border-radius: 10px;
  background-color: #ffffff;
  z-index: 9;
`;

const CloseButton = styled.span`
  display: block;
  margin-left: 60%;
  font-size: 16px;
`;

function Tags() {
  const [boxDatas, setboxDatas] = React.useState([]);
  const [showInputBox, setShowInputBox] = React.useState(false);
  const [inputBoxTitle, setInputBoxTitle] = React.useState("");

  React.useEffect(() => {
    let tagBoxData = [];
    async function getTagGroupData() {
      try {
        const tagGroupsDocs = await getDocs(tagGroupsRef);
        const tagGroupIds = [];
        const tagsInfo = [];
        tagGroupsDocs.forEach((doc) => {
          tagBoxData.push({
            title: doc.data().title,
            id: doc.data().id,
            tags: [],
          });
          tagGroupIds.push(doc.data().id);
        });

        await Promise.all(
          tagGroupIds.map(async (id) => {
            const tagQuery = query(tagsRef, where("tagGroupID", "==", id));
            const tagDocs = await getDocs(tagQuery);
            tagDocs.forEach((item) => {
              tagsInfo.push(item.data());
            });
          })
        );
        tagsInfo.forEach((tagItem) => {
          tagBoxData.forEach((boxItem, index) => {
            if (tagItem.tagGroupID === boxItem.id) {
              tagBoxData[index].tags.push(tagItem.name);
            }
          });
        });

        setboxDatas(tagBoxData);
      } catch (err) {
        console.log("fetch failed", err);
      }
    }
    getTagGroupData();
  }, []);

  function showBoxHandler() {
    setShowInputBox(true);
  }
  function inputBoxTitleHandler(e) {
    setInputBoxTitle(e);
  }

  async function addBoxHandler() {
    if (!inputBoxTitle) {
      alert("請輸入標籤櫃名稱");
    } else {
      const setTagGroupsRef = doc(tagGroupsRef);
      await setDoc(setTagGroupsRef, {
        title: inputBoxTitle,
        id: setTagGroupsRef.id,
      });
      setShowInputBox(false);
      setboxDatas([...boxDatas, { title: inputBoxTitle, tags: [] }]);
    }
  }
  function closeInputBoxHandler() {
    setShowInputBox(false);
  }

  return (
    <>
      <Container>
        <h1>書籤櫃</h1>
        <TagBox data={boxDatas} />
      </Container>
      <AddBoxSign onClick={showBoxHandler}>+</AddBoxSign>
      {showInputBox ? (
        <Wrapper>
          <InputBox>
            <h3>請輸入要新增的書籤櫃名稱</h3>
            <CloseButton onClick={closeInputBoxHandler}>x</CloseButton>
            <input
              onChange={(e) => inputBoxTitleHandler(e.target.value)}
              type="text"
            />
            <button onClick={addBoxHandler}>新增標籤櫃</button>
          </InputBox>
        </Wrapper>
      ) : (
        ""
      )}
    </>
  );
}
export default Tags;
