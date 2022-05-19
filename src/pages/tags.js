import { useEffect, useState, useContext } from "react";
import styled from "styled-components";
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
  margin: 3% 15%;
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

function Tags() {
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

  useEffect(() => {
    let data = [];
    setIsLoading(true);
    setDeleteGroupIndex("");
    async function getData() {
      await firebase.getTagGroupsData(userId).then((res) => {
        data.push(...res.tagGroups);
        setGroupData(data);
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
    setDeleteTagData(undefined);
    setIsHintTitle(undefined);
  }

  async function deleteGroupHandler(index) {
    setIsLoading(true);
    // console.log("delete group", index);

    let currentGroupData = [...groupData];
    let tagsArray = currentGroupData[index].tags;
    currentGroupData.splice(index, 1);

    setIsLoading(false);
    if (tagsArray === undefined || tagsArray.length === 0) {
      setGroupData(currentGroupData);
      setIsLoading(false);
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
    // console.log(currentGroupData, "before firebase");
    await firebase
      .updateTagGroup(userId, currentGroupData)
      .then(() => {
        setDeleteTagData(undefined);
        setDeleteGroupIndex(undefined);
        setIsHintTitle(undefined);
        setSelectedBoxIndex(undefined);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <>
      <Container>
        <PageTitle>書籤櫃</PageTitle>
      </Container>

      {isLoading ? (
        <LoadingContainer>
          <Loading />
        </LoadingContainer>
      ) : (
        <TagBoxContainer>
          <TagBox
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
      )}

      {showInputModal && (
        <InputModal
          groupData={groupData}
          setGroupData={setGroupData}
          setShowInputModal={setShowInputModal}
          modalTitle={modalTitle}
          selectedBoxIndex={selectedBoxIndex}
          setSelectedBoxIndex={setSelectedBoxIndex}
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
