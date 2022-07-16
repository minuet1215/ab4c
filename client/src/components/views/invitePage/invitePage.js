import React, { useEffect, useState } from "react";
import { Space, Typography, Button } from "antd";
import MyHeader from "../Header/Header";
import Modal from "../../Modals/Modal";

const mainImagePath = process.env.PUBLIC_URL + "/logo192.png";

function InvitePage() {
  const { Title } = Typography;

  const [ModalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div>
      <MyHeader subTitle="시작 화면" />
      <Space
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100vh",
          flexDirection: "column",
        }}
      >
        <Title>초대하기</Title>
        <img src={mainImagePath} />

        <Button onClick={openModal} type="primary">초대하기</Button>
        <Modal open={ModalOpen} close={closeModal} header="초대하실 이메일을 검색해주세요">
            아아ㅏ앙
        </Modal>
      </Space>
    </div>
  );
}

export default InvitePage;
