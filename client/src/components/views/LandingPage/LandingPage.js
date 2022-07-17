import React, { useEffect } from "react";
import axios from "axios";
import { Space, Typography, Button } from "antd";
import { useNavigate } from "react-router-dom";
import MyHeader from "../Header/Header";
const mainImagePath = process.env.PUBLIC_URL + "/logo192.png";

function LandingPage() {
  const navigate = useNavigate();
  const { Title } = Typography;

  useEffect(() => {
    axios.get("/api/hello").then((response) => {
      console.log(response);
    });
  }, []);

  const onClickHandler = () => {
    axios.get(`/api/users/logout`).then((response) => {
      if (response.data.success) {
        navigate("/login");
      } else {
        alert("로그아웃 하는데 실패 했습니다.");
      }
    });
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
        <Title>안방네컷</Title>
        <img src={mainImagePath} />
        <Button type="primary" onClick={() => navigate("/login")}>
          로그인
        </Button>
        <Button type="primary" onClick={() => navigate("/register")}>
          회원 가입
        </Button>
        <Button type="primary" onClick={() => navigate("/lobby")}>
          사진 찍기
        </Button>
        <Button type="primary" onClick={() => navigate("/group")}>
          누끼 사진 찍기
        </Button>
        <Button type="primary" onClick={onClickHandler}>
          로그아웃
        </Button>
      </Space>
    </div>
  );
}

export default LandingPage;
