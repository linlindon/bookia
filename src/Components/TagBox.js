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
} from "firebase/firestore";
import React from "react";

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

const Tag = styled.p`
  padding: 4px 6px;
  font-size: 14px;
  border: 1px solid #ffb226;
  border-radius: 5px;
`;
const DeleteSign = styled.span``;
const AddSign = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  border: solid 1px black;
  line-height: 2.5;
`;
const AddBoxSign = styled.div`
  width: 50px;
  height: 50px;
  font-size: 26px;
  border-radius: 25px;
  border: solid 1px black;
  line-height: 2;
`;

function TagBox() {
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
  const tagGroupRef = collection(
    db,
    "users",
    "E5EiDYKVIUd0wuHie6N5",
    "tagGroups"
  );
  const tagsRef = collection(db, "users", "E5EiDYKVIUd0wuHie6N5", "tags");
  const [boxDatas, setboxDatas] = React.useState([]);
  let tagBoxData = [];

  React.useEffect(() => {
    async function getTagGroupData() {
      try {
        const tagGroupsDocs = await getDocs(tagGroupRef);
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

        const result = await Promise.all(
          tagGroupIds.map(async (id) => {
            const tagQuery = query(tagsRef, where("tagGroupID", "==", id));
            const tagDocs = await getDocs(tagQuery);
            tagDocs.forEach((item) => {
              tagsInfo.push(item.data());
            });
            return tagDocs;
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

  return (
    <>
      {boxDatas &&
        boxDatas.map((item) => (
          <>
            <TagBoxContainer>
              <BoxName>{item.title}</BoxName>
              <TagsContainer>
                {item.tags.map((i) => (
                  <Tag>
                    {i}
                    <DeleteSign>x</DeleteSign>
                  </Tag>
                ))}
              </TagsContainer>

              <AddSign>新增</AddSign>
            </TagBoxContainer>
            {/* <AddBoxSign>+</AddBoxSign> */}
          </>
        ))}
    </>
  );
}

export default TagBox;
