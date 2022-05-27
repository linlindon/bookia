import { useEffect, useState, useContext, useRef } from "react";
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
  justify-content: center;
  align-items: center;
`;

const TagBoxContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: center;
  align-content: space-around;
  width: 70%;
  max-width: 1280px;
  margin: 3% 15%;

  @media only screen and (max-width: 1280px) {
    margin: 2% 6%;
  }
`;

const PageTitle = styled.h1`
  @media only screen and (max-width: 768px) {
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
  const [deleteTagData, setDeleteTagData] = useState([]);
  const [groupData, setGroupData] = useState([]);
  const [selectedBoxIndex, setSelectedBoxIndex] = useState(undefined);
  const [notesBoxData, setNotesBoxData] = useState([]);
  const [noDataHint, setNoDataHint] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const userId = useContext(UserProfile);
  let allNotesRef = useRef([]);
  let chosenTagsRef = useRef([]);

  useEffect(() => {
    let data = [];
    allNotesRef.current = [];
    setIsLoading(true);

    async function getData() {
      await firebase.getTagGroupsData(userId).then((res) => {
        data.push(...res.tagGroups);
        setGroupData(data);
        setIsLoading(false);
      });
      await firebase.getAllNotesData(userId).then((notes) => {
        notes.forEach((note) => {
          allNotesRef.current.push(note.data());
        });
      });
    }
    if (userId) {
      getData();
    }
  }, [userId]);

  function getTagsNoteData() {
    let currentNoteData = [];
    allNotesRef.current.forEach((note) => {
      if (tools.isNoteIncludeTag(chosenTagsRef.current, note)) {
        currentNoteData.push(note);
      }
    });
    setNoDataHint(
      chosenTagsRef.current.length !== 0 && currentNoteData.length === 0
    );
    setNotesBoxData(currentNoteData);
  }

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
    if (chosenTagsRef.current.includes(tag)) {
      chosenTagsRef.current = chosenTagsRef.current.filter((item) => {
        return item !== tag;
      });
    }
    getTagsNoteData();
    setDeleteTagData([]);
    setIsHintTitle("");
  }

  async function deleteGroupHandler(index) {
    setIsLoading(true);

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
    await firebase
      .updateTagGroup(userId, currentGroupData)
      .then(() => {
        setDeleteTagData([]);
        setIsHintTitle("");
        setSelectedBoxIndex(undefined);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <Container>
      <PageTitle>書籤櫃</PageTitle>

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
            notesBoxData={notesBoxData}
            setNoDataHint={setNoDataHint}
            noDataHint={noDataHint}
            getTagsNoteData={getTagsNoteData}
            ref={chosenTagsRef}
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
          selectedBoxIndex={selectedBoxIndex}
          deleteGroupHandler={deleteGroupHandler}
        />
      )}
    </Container>
  );
}
export default Tags;
