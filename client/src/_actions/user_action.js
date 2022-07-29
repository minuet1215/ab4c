import axios from "axios";
import { LOGIN_USER, REGISTER_USER, AUTH_USER, IS_USER, KAKAO_LOGOUT } from "./types";

export async function loginUser(dataToSubmit) {
  const request = await axios
    .post("/api/users/login", dataToSubmit)
    .then((response) => response.data);

  return {
    type: LOGIN_USER,
    payload: request,
  };
}

export async function registerUser(dataToSubmit) {
  const request = await axios
    .post("/api/users/register", dataToSubmit)
    .then((response) => response.data);

  return {
    type: REGISTER_USER,
    payload: request,
  };
}

export async function auth() {
  const request = await axios
    .get("/api/users/authen")
    .then((response) => response.data);

  return {
    type: AUTH_USER,
    payload: request,
  };
}

export async function isUser(dataToSubmit) {
  const request = await axios
    .post("/api/users/check", dataToSubmit)
    .then((response) => response.data);

  return {
    type: IS_USER,
    payload: request,
  };
}

export async function kakaoLogout(dataToSubmit) {
  const request = await axios
  .post("/api/users/kakaologout", dataToSubmit)
  .then((response) => response.data);
  return {
    type: KAKAO_LOGOUT,
    payload: request,
  };
}
