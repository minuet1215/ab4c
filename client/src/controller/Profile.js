import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginUser, registerUser, isUser } from "../_actions/user_action";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading/Loading";

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
        profileImage: data.properties.profile_image,
        loginType: "kakao",
      };

      let checkUser = await isUser(body);
      if (!checkUser.payload.isUser) {
<<<<<<< Updated upstream
        let doRegister = await registerUser(body);
=======
        await registerUser(body);
      }else{
        await updateProfileImage(body);
>>>>>>> Stashed changes
      }
      dispatch(loginUser(body)).then((res) => {
        navigate("/main");
      });
    } catch (err) {}
  };

  useEffect(() => {
    getProfile();
  }, []);

  return <Loading />;
};

export default Profile;
