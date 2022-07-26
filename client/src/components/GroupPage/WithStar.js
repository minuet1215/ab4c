import styles from "./GroupPage.module.css";
import { useState, forwardRef } from "react";
import BackgroundRemoval from "./Nooki.js";

const WithStar = forwardRef((props, ref) => {
  const handleFile = async (event) => {
    let reader = new FileReader();

    reader.onloadend = async (e) => {
      // 2. 읽기가 완료되면 아래 코드 실행
      const base64 = reader.result;
      let canvas = document.getElementById("myStar");
      let ctx = canvas.getContext("2d");
      if (base64) {
        let ogImg = new Image();
        ogImg.src = base64;
        ogImg.onload = () => {
          canvas.width = ref.captureAreaRef.current.clientWidth;
          canvas.height = ref.captureAreaRef.current.clientHeight;
          ctx.drawImage(ogImg, 0, 0, canvas.width, canvas.height);
          BackgroundRemoval(canvas);
        };
      }
    };
    if (event.target.files[0]) {
      // 1. 파일을 읽어 버퍼에 저장
      reader.readAsDataURL(event.target.files[0]);
    }
  };
  return (
    <>
      <label className={styles.tab_content_input_box} htmlFor="input-file">
        +
      </label>
      <input
        type="file"
        id="input-file"
        style={{ display: "none" }}
        onChange={handleFile}
      />
    </>
  );
});
export default WithStar;
