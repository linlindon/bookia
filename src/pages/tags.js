import { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import { FolderAdd } from "@styled-icons/fluentui-system-regular/FolderAdd";
import firebase from "../utils/firebaseTools";
import TagBox from "../components/TagBox";
import InputModal from "../components/modal/InputModal";
import { UserProfile } from "../App";
import Loading from "../components/Loading";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
`;

const TagBoxContainer = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: 5% 15%;
`;

const PageTitle = styled.h1`
  @media only screen and (max-width: 786px) {
    margin: 5px;
  }
`;
const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 100px;
`;
const SignContainer = styled.div`
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  right: 5.5%;
  bottom: 5%;
  width: 65px;
  height: 65px;
  border-radius: 30px;
  background-color: #ffffff;

  box-shadow: 2px 3px 7px rgb(0 0 0 / 15%);
  transition: 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 2px 10px rgba(0 0 0 / 30%);
  }
`;
const AddBoxSign = styled(FolderAdd)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  color: #dca246;
  cursor: pointer;
`;

let allGroupData = [];

function Tags() {
  const [boxDatas, setboxDatas] = useState([]);
  const [showInputModal, setShowInputModal] = useState(false);
  const [groupData, setGroupData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
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
      {/* <Wrapper> */}
      <Container>
        <PageTitle>書籤櫃</PageTitle>
        {isLoading && (
          <LoadingContainer>
            <Loading />
          </LoadingContainer>
        )}
      </Container>
      <TagBoxContainer>
        <TagBox
          data={boxDatas}
          setboxDatas={setboxDatas}
          groupData={groupData}
          setGroupData={setGroupData}
        />
      </TagBoxContainer>
      {/* </Wrapper> */}
      <SignContainer>
        <AddBoxSign
          onClick={() => setShowInputModal(true)}
          title="新增書籤櫃"
        />
      </SignContainer>
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
