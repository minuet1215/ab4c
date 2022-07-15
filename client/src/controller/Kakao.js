import React from "react";
import { Link } from "react-router-dom";
import kakao_logo from "../images/kakao_login.png"

function Kakao() {
  const REST_API_KEY = "1c16cb196a174ddce815876521f0b5d4";
  const REDIRECT_URI = "http://localhost:3000/oauth/kakao/callback";
  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

  return (
    <>
      <a href={KAKAO_AUTH_URL}>
        <img src={kakao_logo} width={"150px"}></img>
      </a>
    </>
  );
}
export default Kakao;
