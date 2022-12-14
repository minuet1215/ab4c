import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginUser, registerUser, isUser } from "../_actions/user_action";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading/Loading";
import { updateProfileImage } from "../_actions/user_action";

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
        name: data.properties.nickname,
        email: data.kakao_account.email ? data.kakao_account.email : data.id,
        profileImage: data.properties.profile_image,
        loginType: "kakao",
      };

      let checkUser = await isUser(body);
      if (!checkUser.payload.isUser) {
        await registerUser(body);
      } else {
        await updateProfileImage(body);
      }
      dispatch(loginUser(body)).then((res) => {
        navigate("/main");
        window.location.reload();
      });
    } catch (err) {}
  };

  useEffect(() => {
    getProfile();
  }, []);

  return <Loading />;
};

export default Profile;
