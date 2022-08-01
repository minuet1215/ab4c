import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser, isUser } from "../../_actions/user_action";
import { Form, Input } from "antd";
import MyHeader from "../Header/Header";
import { toast } from "react-toastify";

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

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const regExp =
      /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

    if (Email.match(regExp) === null) {
      toast.error("올바른 이메일을 적어주세요 .__. ");
      return;
    }

    if (Password !== ConfirmPassword) {
      return toast.error("비밀번호와 비밀번호 확인은 같아야 합니다 .__.");
    }

    let body = {
      email: Email,
      password: Password,
      name: Name,
      loginType: "local",
    };

    let emailCheck = await isUser(body);
    if (emailCheck.payload.isUser) {
      toast.error("이미 사용 중인 이메일입니다 .__.");
      return;
    }
    let doRegister = await registerUser(body);
    if (doRegister.payload.success) {
      toast.success("가입 성공! 로그인 해주세요 .__.");
      navigate("/login");
    } else {
      toast.error("회원가입에 실패했어요 ㅜ__ㅜ");
    }
  };
  return (
    <div className="outer_container">
      <MyHeader onBackUrl="/" subTitle="회원 가입" />
      <div
        className="contents_container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: "15%",
        }}
      >
        <Form layout="vertical" style={{ width: "50%" }}>
          <Form.Item
            label="이메일"
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
            label="닉네임"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input type="text" value={Name} onChange={onNameHandler} />
          </Form.Item>
          <Form.Item
            label="비밀번호"
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
            label="비밀번호 확인"
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

          <button
            type="submit"
            className="button button_gap btn_1"
            style={{ marginTop: "10px" }}
            onClick={onSubmitHandler}
          >
            회원 가입
          </button>
        </Form>
      </div>
    </div>
  );
}

export default RegisterPage;
