import React from "react";

const KakaoLogout = () => {
  if (window.Kakao.Auth.getAccessToken()) {
    window.Kakao.API.request({
      url: "/v1/user/unlink",
      success: function (response) {
        console.log(response);
      },
      fail: function (error) {
        console.log(error);
      },
    });
    alert("로그아웃이 완료되었습니다.");
    window.Kakao.Auth.setAccessToken(undefined);
  }
};

export default KakaoLogout;
