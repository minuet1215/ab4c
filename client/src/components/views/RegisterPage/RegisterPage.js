import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../../_actions/user_action";
import { Form, Input, Button } from "antd";
import MyHeader from "../Header/Header";

function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [Email, setEmail] = useState("");
  const [Name, setName] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");

  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value);
  };

  const onNameHandler = (event) => {
    setName(event.currentTarget.value);
  };

  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value);
  };

  const onConfirmPasswordHandler = (event) => {
    setConfirmPassword(event.currentTarget.value);
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();

    if (Password !== ConfirmPassword) {
      return alert("비밀번호와 비밀번호 확인은 같아야 합니다.");
    }

    let body = {
      email: Email,
      password: Password,
      name: Name,
      loginType: "local",
    };

    dispatch(registerUser(body)).then((response) => {
      if (response.payload.success) {
        navigate("/login");
      } else {
        alert("회원가입이 실패하였습니다.");
      }
    });
  };
  return (
    <div>
      <MyHeader subTitle="회원 가입 화면" />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100vh",
        }}
      >
        <Form style={{ display: "flex", flexDirection: "column" }}>
          <Form.Item
            label="Email"
            rules={[
              {
                type: "email",
                required: true,
              },
            ]}
          >
            <Input value={Email} onChange={onEmailHandler} />
          </Form.Item>
          <Form.Item
            label="Name"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input type="text" value={Name} onChange={onNameHandler} />
          </Form.Item>
          <Form.Item
            label="Password"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input
              type="password"
              value={Password}
              onChange={onPasswordHandler}
            />
          </Form.Item>
          <Form.Item
            label="Confirm Password"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input
              type="password"
              value={ConfirmPassword}
              onChange={onConfirmPasswordHandler}
            />
          </Form.Item>

          <Button type="primary" htmlType="submit" onClick={onSubmitHandler}>
            회원 가입
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default RegisterPage;
