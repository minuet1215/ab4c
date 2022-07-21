import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { enterRoom } from "../../_actions/room_action";
import MyHeader from "../Header/Header";
// import AutoSlides from "./AutoSlides";

function UserMain() {
  // const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  return (
    <div className="container">
      <MyHeader subTitle="메인 화면" />
      <div className="contents_container center">
        <button
          className="button button_gap btn_1"
          onClick={() => navigate(`/group/${token}`)}
        >
          촬영하기
        </button>
        <button
          className="button button_gap btn_2"
          onClick={() => navigate("/album")}
        >
          내 앨범
        </button>
      </div>
      {/* <AutoSlides /> */}
    </div>
  );
}

export default UserMain;
