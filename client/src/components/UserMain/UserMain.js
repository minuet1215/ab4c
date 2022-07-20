import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { enterRoom } from "../../_actions/room_action";
import MyHeader from "../Header/Header";

function UserMain() {
  // const dispatch = useDispatch();
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
      <MyHeader subTitle="메인 화면" />
      <div className="contents_container center">
        <button className="button_gap btn_1" onClick={() => navigate("/group")}>
          촬영하기
        </button>
        <button className="button_gap btn_2" onClick={() => navigate("/album")}>
          내 앨범
        </button>
      </div>
    </div>
  );
}

export default UserMain;
