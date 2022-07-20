import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { enterRoom } from "../../_actions/room_action";
import { Layout, Menu, Form, Input, Button } from "antd";
import MyHeader from "../Header/Header";
import styles from "./LobbyPage.module.css";

function LobbyPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const [RoomNumber, setRoomNumber] = useState("");
  // const onRoomNumberHandler = (event) => {
  //   setRoomNumber(event.currentTarget.value);
  // };

  // const onEnterRoomBtnHandler = (event) => {
  //   event.preventDefault();

  //   console.log(RoomNumber);
  //   if (!RoomNumber) {
  //     return alert("> 그룹에 참가할 수 없습니다.");
  //   }

  //   let body = {
  //     roomNumber: RoomNumber,
  //   };

  //   dispatch(enterRoom(body)).then((response) => {
  //     if (response.payload.success) {
  //       navigate("/video_call/" + body.roomNumber); // 페이지 이동
  //     } else {
  //       alert("그룹에 참가할 수 없습니다.");
  //     }
  //   });
  // };
  return (
    <div className="container">
      <MyHeader subTitle="대기실" onBackUrl="/main" />
      <div
        className="contents_container center"
        style={{ paddingBottom: "5%" }}
      >
        <h1>멤버</h1>
        <div className={styles.member_container}></div>
        <div style={{ paddingBottom: "5%" }}>
          <button
            className="button_gap btn_1"
            onClick={() => navigate("/group")}
          >
            입장
          </button>
          <button className="button_gap btn_2">초대</button>
        </div>
      </div>
    </div>
  );
}

export default LobbyPage;
