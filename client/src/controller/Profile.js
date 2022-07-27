import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginUser, registerUser, isUser } from "../_actions/user_action";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading/Loading";

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
      
      let checkUser = await isUser(body);
      
      if (!checkUser.payload.isUser){
        let doRegister = await registerUser(body)
      }
      dispatch(loginUser(body)).then((res) => {
        navigate('/main');
      })
    } catch (err) {}
  };

  useEffect(() => {
    getProfile();
  }, []);

  return <Loading />;
};

export default Profile;
