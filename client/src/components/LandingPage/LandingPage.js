import React from "react";
import { useNavigate } from "react-router-dom";
import main_img from "../../img/dog.png";
import Logout from "../Logout/Logout";
import styles from "./LandingPage.module.css";

function LandingPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  return (
    <div className="container">
      <div className="center">
        <div
          className={styles.title_container}
          onClick={() => navigate("/main")}
        >
          <title className={styles.main_title}>안방네컷</title>
        </div>
        <div className={styles.img_container}>
          <img className={styles.main_img} src={main_img} alt="logo" />
        </div>
        <div className={styles.control_container}>
          {!token && (
            <>
              <button
                className="button button_gap btn_1"
                onClick={() => navigate("/login")}
              >
                로그인
              </button>
              <button
                className="button button_gap btn_2"
                onClick={() => navigate("/register")}
              >
                회원가입
              </button>
            </>
          )}
          <Logout />
          {/* 
          <Button type="primary" onClick={() => navigate("/group")}>
            누끼 사진 찍기
          </Button>
          <Button type="primary" onClick={() => navigate("/edit")}>
            프레임 수정 및 서버에 이미지 저장
          </Button> */}
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
