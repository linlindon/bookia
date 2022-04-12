import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
`;
const Title = styled.h1``;

const TagBoxContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 60%;
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

function TagBox() {
  return (
    <TagBoxContainer>
      <BoxName>人物關係</BoxName>
      <TagsContainer>
        <Tag>親情</Tag>
        <Tag>友情</Tag>
        <Tag>友情</Tag>
        <Tag>友情</Tag>
        <Tag>友情</Tag>
        <Tag>友情</Tag>
      </TagsContainer>
    </TagBoxContainer>
  );
}

export default TagBox;
