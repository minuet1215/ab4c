import React from "react";

function Kakao() {
  const REST_API_KEY = process.env.REACT_APP_REST_API_KEY;
  const REDIRECT_URI = "http://localhost:3000/oauth/kakao/callback";
  // const REDIRECT_URI = "http://www.4cut.shop/oauth/kakao/callback";
  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

  return (
    <button className="button button_gap sign_in_kakao">
      <a style={{ color: "#555555" }} href={KAKAO_AUTH_URL}>
        <div> 카카오로 시작하기</div>
      </a>
    </button>
  );
}
export default Kakao;
