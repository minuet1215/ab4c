import React from "react";
import styled from "styled-components";
import loadingImg from "./loadingImg.gif";

const Background = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: #ffffffb7;
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const Loading = () => {
  return (
    <Background>
      <img src={loadingImg} alt="로딩중" />
    </Background>
  );
};

export default Loading;
