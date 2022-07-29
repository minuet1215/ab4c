import React from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { auth, kakaoLogout } from "../../_actions/user_action";
// import { Typography } from "antd";
import { toast } from "react-toastify";

function Logout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onClickHandler = async () => {
    const confirmLogout = window.confirm("로그아웃 하시겠습니까?");
    if (confirmLogout === true) {
      let isAuth = await auth();
      if (isAuth.payload.loginType === "kakao") {
        const myAccessKey = localStorage.getItem("token");
        dispatch(kakaoLogout({token : myAccessKey})).then((response) => {})
      }
      axios.get("/api/users/logout1").then((response) => {
        if (response.data.success) {
          localStorage.clear();
          toast.success("로그아웃 되었습니다.");
          navigate("/login");
        } else {
          toast.error("로그아웃 하는데 실패 했습니다.");
        }
      });
    }
  };

  return (
    <button className="button button_gap btn_3" onClick={onClickHandler}>
      로그아웃
    </button>
  );
}

export default Logout;
