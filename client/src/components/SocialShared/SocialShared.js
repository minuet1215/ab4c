//App.js
import React from "react";
import styled from "styled-components";
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterIcon,
  TwitterShareButton,
} from "react-share";

// 제목과 버튼을 감싸는 컨테이너
const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// 버튼을 배치시키는 컨테이너
const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 48px);
  grid-column-gap: 8px;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
`;

const SocialShared = () => {
  const currentUrl = window.location.href;
  return (
    <FlexContainer>
      <h1>공유하기</h1>
      <GridContainer>
        <FacebookShareButton url={currentUrl}>
          <FacebookIcon size={48} round={true} borderRadius={24}></FacebookIcon>
        </FacebookShareButton>
        <TwitterShareButton url={currentUrl}>
          <TwitterIcon size={48} round={true} borderRadius={24}></TwitterIcon>
        </TwitterShareButton>
      </GridContainer>
    </FlexContainer>
  );
};

export default SocialShared;
