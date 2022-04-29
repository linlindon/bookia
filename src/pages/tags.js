import { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import firebase from "../utils/firebaseTools";
import TagBox from "../components/TagBox";
import { UserProfile } from "../App";

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
let allGroupData = [];
let groupTitle = "";
function Tags() {
  const [boxDatas, setboxDatas] = useState([]);
  const [showInputBox, setShowInputBox] = useState(false);
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
      // const userDoc = await getDoc(userRef);
      // data.push(...userDoc.data().tagGroups);
      // console.log(allGroupData);
    }
    getData();
  }, []);

  function showBoxHandler() {
    setShowInputBox(true);
  }

  async function addBoxHandler(e) {
    e.preventDefault();
    if (!groupTitle) {
      alert("請輸入標籤櫃名稱");
    } else {
      console.log(groupTitle);
      allGroupData.push({ name: groupTitle, tags: [] });
      await firebase.updateTagGroup(userId, allGroupData);
      setShowInputBox(false);
      setGroupData(allGroupData);
    }
  }
  function closeInputBoxHandler() {
    setShowInputBox(false);
  }

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
      <AddBoxSign onClick={showBoxHandler}>+</AddBoxSign>
      {showInputBox && (
        <Wrapper>
          <InputBox>
            <h3>請輸入要新增的書籤櫃名稱</h3>
            <CloseButton onClick={closeInputBoxHandler}>x</CloseButton>
            <form onSubmit={(e) => addBoxHandler(e)}>
              <input
                onChange={(e) => (groupTitle = e.target.value)}
                type="text"
              />
              <button onSubmit={addBoxHandler}>新增標籤櫃</button>
            </form>
          </InputBox>
        </Wrapper>
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
