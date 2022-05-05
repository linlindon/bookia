import { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import { FolderAdd } from "@styled-icons/fluentui-system-filled/FolderAdd";
import firebase from "../utils/firebaseTools";
import TagBox from "../components/TagBox";
import InputModal from "../components/modal/InputModal";
import { UserProfile } from "../App";
import Loading from "../components/Loading";

const Wrapper = styled.div`
  ${"" /* display: flex; */}
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
`;

const PageTitle = styled.h1`
  @media only screen and (max-width: 786px) {
    margin: 5px;
  }
`;
const LoadingContainer = styled.div`
  margin-top: 100px;
`;
const AddBoxSign = styled(FolderAdd)`
  position: fixed;
  right: 6%;
  bottom: 5%;
  width: 50px;
  height: 50px;
  color: #3fccdc;
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
  const [isLoading, setIsLoading] = useState(true);
  const userId = useContext(UserProfile);

  useEffect(() => {
    let data = [];
    setIsLoading(true);
    async function getData() {
      await firebase.getTagGroupsData(userId).then((res) => {
        data.push(...res.tagGroups);
        setGroupData(data);
        allGroupData = data;
        setIsLoading(false);
      });
    }
    getData();
  }, []);

  return (
    <>
      <Wrapper>
        <Container>
          <PageTitle>書籤櫃</PageTitle>
          {isLoading && (
            <LoadingContainer>
              <Loading />
            </LoadingContainer>
          )}
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
