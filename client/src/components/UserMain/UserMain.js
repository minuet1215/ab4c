import React from "react";
import { useNavigate } from "react-router-dom";
import MyHeader from "../Header/Header";
import AutoSlides from "./AutoSlides";

function UserMain() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  return (
    <div className="container">
      <MyHeader subTitle="메인 화면" />
      <div className="contents_container center">
        <AutoSlides />
        <div style={{ display: "flex", height: "74px" }}>
          <button
            className="button button_gap btn_1"
            style={{ height: "100%", margin: "10px" }}
            onClick={() => navigate(`/group/${token}`)}
          >
            촬영하기
          </button>
          <button
            className="button button_gap btn_2"
            style={{ height: "100%", margin: "10px" }}
            onClick={() => navigate("/album")}
          >
            내 앨범
          </button>

          <button
            className="button button_gap btn_3"
            style={{ height: "100%", margin: "10px" }}
            onClick={() => navigate("/allalbum")}
          >
            전체앨범
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserMain;
