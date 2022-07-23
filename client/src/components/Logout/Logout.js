import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { auth, kakaoLogout } from "../../_actions/user_action";
import { Typography } from "antd";
import {toast} from "react-toastify";

function Logout() {
  const REST_API_KEY = "1c16cb196a174ddce815876521f0b5d4";

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { Title } = Typography;

  const onClickHandler = () => {
    dispatch(auth()).then((response) => {
      if (response.payload.loginType === "kakao") {
        const myAccessKey = localStorage.getItem("token");
        dispatch(kakaoLogout({ token: myAccessKey })).then((response) => {});
      }
      axios.get("/api/users/logout1").then((response) => {
        if (response.data.success) {
          localStorage.clear();
          sessionStorage.clear();
          toast.success("로그아웃 되었습니다.");
          navigate("/login");
        } else {
          toast.error("로그아웃 하는데 실패 했습니다.");
        }
      });
    });
  };

  return (
    <button className="button button_gap" onClick={onClickHandler}>
      로그아웃
    </button>
  );
}

export default Logout;
