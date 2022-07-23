import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../_actions/user_action";
import { Form, Input } from "antd";
import MyHeader from "../Header/Header";
import Kakao from "../../controller/Kakao";

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value);
  };

  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value);
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();

    let body = {
      email: Email,
      password: Password,
      isLocal: true,
    };

    dispatch(loginUser(body)).then((response) => {
      if (response.payload.loginSuccess) {
        localStorage.setItem("token", response.payload.token); // 자체 로그인도 로컬스토리지에 토큰값 저장
        navigate("/main"); // 페이지 이동
      } else {
        alert(response.payload.message);
      }
    });
  };

  return (
    <div className="container">
      <MyHeader subTitle="로그인 화면" />
      <div className="contents_container">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
            flexDirection: "column",
            paddingBottom: "5%",
          }}
        >
          <Form layout="vertical" size="large">
            <Form.Item label="이메일">
              <Input type="email" value={Email} onChange={onEmailHandler} />
            </Form.Item>
            <Form.Item label="비밀번호">
              <Input
                type="password"
                value={Password}
                onChange={onPasswordHandler}
              />
            </Form.Item>
          </Form>
          <button
            type="submit"
            className="button button_gap"
            style={{ width: "200px" }}
            onClick={onSubmitHandler}
          >
            로그인
          </button>
          <Kakao />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
