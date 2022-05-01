import { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import { FolderAdd } from "@styled-icons/fluentui-system-filled/FolderAdd";
import { MediaQuerySmall, MediaQueryLarge } from "../utils/globalStyle/styles";
import firebase from "../utils/firebaseTools";
import TagBox from "../components/TagBox";
import InputModal from "../components/modal/InputModal";
import { UserProfile } from "../App";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  ${"" /* width: 100%; */}
  margin-bottom: 20px;
`;

const PageTitle = styled.h1`
  @media only screen and (max-width: 786px) {
    margin: 5px;
  }
`;

const AddBoxSign = styled(FolderAdd)`
  position: fixed;
  right: 6%;
  bottom: 5%;
  width: 50px;
  height: 50px;
  color: #3fccdc;
  font-size: 26px;
  cursor: pointer;

  @media only screen and (max-width: 786px) {
    width: 40px;
  }
`;

let allGroupData = [];

function Tags() {
  const [boxDatas, setboxDatas] = useState([]);
  const [showInputModal, setShowInputModal] = useState(false);
  const [groupData, setGroupData] = useState([]);
  const userId = useContext(UserProfile);

  useEffect(() => {
    let data = [];
    async function getData() {
      await firebase.getTagGroupsData(userId).then((res) => {
        data.push(...res.tagGroups);
        setGroupData(data);
        allGroupData = data;
      });
    }
    getData();
  }, []);

  return (
    <>
      <Wrapper>
        <Container>
          <PageTitle>書籤櫃</PageTitle>
          <TagBox
            data={boxDatas}
            setboxDatas={setboxDatas}
            groupData={groupData}
            setGroupData={setGroupData}
          />
        </Container>
      </Wrapper>
      <AddBoxSign onClick={() => setShowInputModal(true)} title="新增書籤櫃" />
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
