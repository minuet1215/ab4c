import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginUser, registerUser } from "../_actions/user_action";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getProfile = async () => {
    try {
      // Kakao SDK API를 이용해 사용자 정보 획득
      let data = await window.Kakao.API.request({
        url: "/v2/user/me",
      });

      let body = {
        id: data.id,
        name: data.properties.nickname,
        email: data.kakao_account.email,
        imageUrl: data.properties.profile_image,
        loginType: "kakao",
      };

      // kakao user 정보 backend로 보내는 파트
      dispatch(registerUser(body)) // 우선 user 데이터를 db에 저장
        .then((response) => {
          // 저장에 성공할 경우
          dispatch(loginUser(body)) // 로그인 과정을 거침
            .then((response) => {
              // console.log("login success!!!");
              navigate("/main");
            });
        });
    } catch (err) {}
  };

  useEffect(() => {
    getProfile();
  }, []);

  return <div>로그인 중입니다...</div>;
};

export default Profile;
