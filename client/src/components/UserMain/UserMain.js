import { Modal, Input } from "antd";
import React, { useState } from "react";
import { event } from "react-ga";
import { useNavigate } from "react-router-dom";
import MyHeader from "../Header/Header";
import AutoSlides from "./AutoSlides";

function UserMain() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [isModalVisible, setModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [friendId, setFriendId] = useState("");
  const { Search } = Input;

  const onFriendIdHandler = (event) => {
    setFriendId(event.currentTarget.value);
  };
  const showModal = () => {
    setModalVisible(true);
  };
  const handleModalCancel = () => {
    setModalVisible(false);
  };
  console.log(friendId);

  return (
    <div className="outer_container">
      <MyHeader subTitle="메인 화면" />
      <div
        className="contents_container center"
        style={{
          marginTop: "-15%",
        }}
      >
        <AutoSlides />
      </div>
      <div style={{ display: "flex", height: "74px", margin: "-9% 10% 0 9%" }}>
        <button
          className="button button_gap btn_1"
          style={{ height: "100%", margin: "10px", fontSize: "24px" }}
          onClick={() => navigate(`/group/${token}`)}
        >
          촬영하기
        </button>
        <button
          className="button button_gap btn_2"
          style={{ height: "100%", margin: "10px", fontSize: "24px" }}
          onClick={() => navigate("/album")}
        >
          내 앨범
        </button>

        <button
          className="button button_gap btn_3"
          style={{ height: "100%", margin: "10px", fontSize: "24px" }}
          onClick={() => navigate("/allalbum")}
        >
          전체 앨범
        </button>
        <button
          className="button button_gap btn_3"
          style={{ height: "100%", margin: "10px", fontSize: "24px" }}
          onClick={showModal}
        >
          친구 검색
        </button>
      </div>
      <Modal
        title="친구를 검색해보세요"
        visible={isModalVisible}
        confirmLoading={confirmLoading}
        onCancel={handleModalCancel}
        footer={null}
        centered={true}
      >
        <div>
          <Search
            onChange={onFriendIdHandler}
            placeholder="이메일을 입력하세요"
            enterButton
          />
        </div>
      </Modal>
    </div>
  );
}

export default UserMain;
