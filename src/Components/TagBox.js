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
} from "firebase/firestore";
import { tagsRef, tagGroupsRef } from "../utils/fireBaseConfig";

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
// const DeleteSign = styled.span``;
const AddSign = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  border: solid 1px black;
  line-height: 2.5;
`;

function TagBox() {
  const [boxDatas, setboxDatas] = React.useState([]);

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

  return (
    <>
      {boxDatas.map((box) => (
        <TagBoxContainer>
          <BoxName>{box.title}</BoxName>
          <TagsContainer>
            {box.tags.map((tag, index) => (
              <Tag key={index}>{tag}</Tag>
            ))}
          </TagsContainer>
          <AddSign>新增</AddSign>
        </TagBoxContainer>
      ))}
    </>
  );
}

export default TagBox;
