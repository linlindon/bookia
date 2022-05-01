import { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import { FolderAdd } from "@styled-icons/fluentui-system-filled/FolderAdd";
import firebase from "../utils/firebaseTools";
import TagBox from "../components/TagBox";
import InputModal from "../components/modal/InputModal";
import { UserProfile } from "../App";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
`;

const AddBoxSign = styled(FolderAdd)`
  position: absolute;
  right: 10%;
  width: 50px;
  height: 50px;
  color: #3fccdc;
  font-size: 26px;
`;

let allGroupData = [];

function Tags() {
  const [boxDatas, setboxDatas] = useState([]);
  const [showInputModal, setShowInputModal] = useState(false);
  const [groupData, setGroupData] = useState([]);
  const userId = useContext(UserProfile);
  console.log("tags render");
  useEffect(() => {
    console.log("tags render inside use effect");
    let data = [];
    async function getData() {
      await firebase.getTagGroupsData(userId).then((res) => {
        data.push(...res.tagGroups);
        setGroupData(data);
        allGroupData = data;
      });
    }
    getData();
    console.log(groupData);
  }, []);

  return (
    <>
      <Container>
        <h1>書籤櫃</h1>
        <TagBox
          data={boxDatas}
          setboxDatas={setboxDatas}
          groupData={groupData}
          setGroupData={setGroupData}
        />
      </Container>
      <AddBoxSign onClick={() => setShowInputModal(true)} />
      {showInputModal && (
        <InputModal
          groupData={groupData}
          setGroupData={setGroupData}
          setShowInputModal={setShowInputModal}
          modalTitle={"新書籤櫃名稱"}
        />
      )}
    </>
  );
}
export default Tags;

// async function getTagGroupData() {
//   try {
//     const tagGroupsDocs = await getDocs(tagGroupsRef);
//     const tagGroupIds = [];
//     const tagsInfo = [];
//     tagGroupsDocs.forEach((doc) => {
//       tagBoxData.push({
//         title: doc.data().title,
//         id: doc.data().id,
//         tags: [],
//       });
//       tagGroupIds.push(doc.data().id);
//     });

//     await Promise.all(
//       tagGroupIds.map(async (id) => {
//         const tagQuery = query(tagsRef, where("tagGroupID", "==", id));
//         const tagDocs = await getDocs(tagQuery);
//         tagDocs.forEach((item) => {
//           tagsInfo.push(item.data());
//         });
//       })
//     );
//     tagsInfo.forEach((tagItem) => {
//       tagBoxData.forEach((boxItem, index) => {
//         if (tagItem.tagGroupID === boxItem.id) {
//           tagBoxData[index].tags.push(tagItem.name);
//         }
//       });
//     });

//     setboxDatas(tagBoxData);
//   } catch (err) {
//     console.log("fetch failed", err);
//   }
// }
