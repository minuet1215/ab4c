import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../_actions/user_action";
import { Space, Form, Input, Button } from "antd";
import MyHeader from "../Header/Header";

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
        navigate("/main"); // 페이지 이동
      } else {
        alert("로그인 실패");
      }
    });
  };

  return (
    <div>
      <MyHeader subTitle="로그인 화면" />
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
        <Form layout="vertical">
          <Form.Item label="Email">
            <Input type="email" value={Email} onChange={onEmailHandler} />
          </Form.Item>
          <Form.Item label="Password">
            <Input
              type="password"
              value={Password}
              onChange={onPasswordHandler}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                width: "100%",
                color: "white",
                background: "#fc8da1",
                // radius: "10px",
                border: "0",
              }}
              onClick={onSubmitHandler}
            >
              로그인
            </Button>
          </Form.Item>
        </Form>
      </Space>
    </div>
  );
}

export default LoginPage;
