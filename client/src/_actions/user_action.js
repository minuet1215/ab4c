import axios from "axios";
import { LOGIN_USER, REGISTER_USER, AUTH_USER, IS_USER, KAKAO_LOGOUT } from "./types";

export function loginUser(dataToSubmit) {
  const request = axios
    .post("/api/users/login", dataToSubmit)
    .then((response) => response.data);

  return {
    type: LOGIN_USER,
    payload: request,
  };
}

export function registerUser(dataToSubmit) {
  const request = axios
    .post("/api/users/register", dataToSubmit)
    .then((response) => response.data);

  return {
    type: REGISTER_USER,
    payload: request,
  };
}

export function auth() {
  const request = axios
    .get("/api/users/authen")
    .then((response) => response.data);

  return {
    type: AUTH_USER,
    payload: request,
  };
}

export function isUser(dataToSubmit) {
  const request = axios
    .post("/api/users/check", dataToSubmit)
    .then((response) => response.data);

  return {
    type: IS_USER,
    payload: request,
  };
}

export function kakaoLogout(dataToSubmit) {
  const request = axios
  .post("/api/users/kakaologout", dataToSubmit)
  .then((response) => response.data);
  return {
    type: KAKAO_LOGOUT,
    payload: request,
  };
}
