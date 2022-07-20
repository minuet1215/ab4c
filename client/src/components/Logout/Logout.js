import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { auth } from "../../_actions/user_action";
import { Typography } from "antd";

function Logout() {
  const REST_API_KEY = "1c16cb196a174ddce815876521f0b5d4";

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { Title } = Typography;

  const onClickHandler = () => {
    dispatch(auth()).then((response) => {
      if (response.payload.loginType === "kakao") {
        window.Kakao.init(REST_API_KEY);
        window.Kakao.Auth.logout(() => {
          localStorage.clear();
        });
      }
      axios.get("/api/users/logout1").then((response) => {
        if (response.data.success) {
          alert("로그아웃 되었습니다.");
          navigate("/login");
        } else {
          alert("로그아웃 하는데 실패 했습니다.");
        }
      });
    });
  };

  return (
    <button type="primary" className="button" onClick={onClickHandler}>
      로그아웃
    </button>
  );
}

export default Logout;
