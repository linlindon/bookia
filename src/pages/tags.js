import { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import { FolderAdd } from "@styled-icons/fluentui-system-regular/FolderAdd";
import firebase from "../utils/firebaseTools";
import tools from "../utils/tools";
import TagBox from "../components/TagBox";
import InputModal from "../components/modal/InputModal";
import HintModal from "../components/modal/HintModal";
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
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: center;
  align-content: space-around;
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
  const [modalTitle, setModalTitle] = useState("");
  const [isConfirmClose, setIsConfirmClose] = useState(false);
  const [isHint, setIsHint] = useState(false);
  const [hintTitle, setIsHintTitle] = useState("");
  const [deleteTagData, setDeleteTagData] = useState(undefined);
  const [deleteGroupIndex, setDeleteGroupIndex] = useState(undefined);
  const [groupData, setGroupData] = useState([]);
  const [selectedBoxIndex, setSelectedBoxIndex] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const userId = useContext(UserProfile);
  console.log("tags render");

  useEffect(() => {
    let data = [];
    setIsLoading(true);

    setDeleteGroupIndex("");

    async function getData() {
      await firebase.getTagGroupsData(userId).then((res) => {
        data.push(...res.tagGroups);
        setGroupData(data);
        allGroupData = data;
        setIsLoading(false);
      });
    }
    if (userId) {
      getData();
    }
  }, [userId]);

  async function deleteTagHandler(tag, index) {
    let currentGroupData = [...groupData];
    let changeTagArray = currentGroupData[index].tags.filter((name) => {
      return name !== tag;
    });
    currentGroupData[index].tags = [...changeTagArray];
    setGroupData(currentGroupData);
    await firebase.updateTagGroup(userId, currentGroupData);
    await tools.deleteNotesTag(userId, tag);
    await tools.deleteBooksTag(userId, tag);
    console.log("delet tag data final");
    setDeleteTagData(undefined);
    setIsHintTitle(undefined);
  }

  async function deleteGroupHandler(index) {
    setIsLoading(true);
    console.log("delete group");

    let currentGroupData = [...groupData];
    let tagsArray = currentGroupData[index].tags;
    currentGroupData.splice(index, 1);
    console.log(currentGroupData);
    console.log(tagsArray);
    setIsLoading(false);
    if (tagsArray === undefined || tagsArray.length === 0) {
      setGroupData(currentGroupData);
      setIsLoading(false);
      return;
    } else {
      await Promise.all(
        tagsArray.map(async (tag) => {
          await tools.deleteNotesTag(userId, tag);
        })
      );
      await Promise.all(
        tagsArray.map(async (tag) => {
          await tools.deleteBooksTag(userId, tag);
        })
      );
      setGroupData([...currentGroupData]);
    }
    await firebase.updateTagGroup(userId, currentGroupData).then(() => {
      setDeleteTagData(undefined);
      setIsHintTitle(undefined);
      setIsLoading(false);
    });
  }

  console.log(groupData);

  return (
    <>
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
          setShowInputModal={setShowInputModal}
          setModalTitle={setModalTitle}
          setSelectedBoxIndex={setSelectedBoxIndex}
          setIsHint={setIsHint}
          setIsHintTitle={setIsHintTitle}
          setIsConfirmClose={setIsConfirmClose}
          setDeleteTagData={setDeleteTagData}
          setDeleteGroupIndex={setDeleteGroupIndex}
        />
      </TagBoxContainer>

      <SignContainer>
        <AddBoxSign
          onClick={() => {
            setModalTitle("新書籤櫃名稱");
            setShowInputModal(true);
          }}
          title="新增書籤櫃"
        />
      </SignContainer>
      {showInputModal && (
        <InputModal
          groupData={groupData}
          setGroupData={setGroupData}
          setShowInputModal={setShowInputModal}
          modalTitle={modalTitle}
          selectedBoxIndex={selectedBoxIndex}
        />
      )}
      {isHint && (
        <HintModal
          hintTitle={hintTitle}
          isConfirmClose={isConfirmClose}
          setIsHint={setIsHint}
          deleteTagData={deleteTagData}
          deleteTagHandler={deleteTagHandler}
          deleteGroupIndex={deleteGroupIndex}
          deleteGroupHandler={deleteGroupHandler}
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
