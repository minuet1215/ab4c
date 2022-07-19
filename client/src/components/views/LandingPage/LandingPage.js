import Kakao from "../../../controller/Kakao";
import React from "react";
import { Space, Typography, Button } from "antd";
import { useNavigate } from "react-router-dom";
import main_img from "../../../img/dog.png";
import Logout from "../Logout/Logout";

function LandingPage() {
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
