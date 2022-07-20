import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginUser, registerUser, isUser } from "../_actions/user_action";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 127.0.0.1
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
      console.log(body);

      dispatch(isUser(body)).then((response) => {
        if (!response.payload.isUser) {
          dispatch(registerUser(body)).then((res) => {
            dispatch(loginUser(body)) // 로그인 과정을 거침
              .then((response) => {
                navigate("/main");
              });
          });
        } else {
          dispatch(loginUser(body)) // 로그인 과정을 거침
            .then((response) => {
              navigate("/main");
            });
        }
      });
    } catch (err) {}
  };

  useEffect(() => {
    getProfile();
  }, []);

  return <div>로그인 중입니다...</div>;
};

export default Profile;
