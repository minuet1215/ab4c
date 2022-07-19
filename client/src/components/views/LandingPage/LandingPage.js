import Kakao from "../../../controller/Kakao";
import React, { useEffect } from "react";
import axios from "axios";
import { Space, Typography, Button } from "antd";
import { useNavigate } from "react-router-dom";
import main_img from "../../../img/dog.png";
import { useDispatch } from "react-redux";
import { auth } from "../../../_actions/user_action";
import Logout from "../Logout/Logout";

function LandingPage() {
  // const REST_API_KEY = "1c16cb196a174ddce815876521f0b5d4";

  const navigate = useNavigate();
  const { Title } = Typography;

  return (
    <div>
      <Space
        className="main_page"
        style={{
          flexDirection: "column",
        }}
      >
        <Title className="main_title">안방네컷</Title>
        <img className="main_img" src={main_img} />
        <div className="buttons">
          <Kakao />
          <button
            type="primary"
            className="button sign_in"
            onClick={() => navigate("/login")}
          >
            로그인
          </button>
          <button
            type="primary"
            className="button sign_up"
            onClick={() => navigate("/register")}
          >
            회원가입
          </button>
          <button
            type="primary"
            className="button"
            onClick={() => navigate("/lobby")}
          >
            사진 찍기
          </button>
          <Button type="primary" onClick={() => navigate("/group")}>
            누끼 사진 찍기
          </Button>
          <Logout />
        </div>
      </Space>
    </div>
  );
}

export default LandingPage;
