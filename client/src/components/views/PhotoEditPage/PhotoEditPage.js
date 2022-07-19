import React, { useRef, useEffect, useState } from "react";
import styles from "./PhotoEditPage.module.css";
import axios from "axios";

import img1 from "../../../img/1.jpg";
import img2 from "../../../img/2.jpg";
import img3 from "../../../img/3.jpg";
import img4 from "../../../img/4.jpg";
import bgImg1 from "../../../img/5.jpg";
import bgImg2 from "../../../img/6.jpg";
const img_width = 550;
const img_height = 370;
const gap = 20;
const frame_width = img_width + 2 * gap;
const frame_height = 4 * (img_height + gap) + 300;

function PhotoEditPage() {
  // ================= dummy data ================= //
  const images = [
    { src: img1, x: gap, y: gap },
    { src: img2, x: gap, y: 1 * (img_height + gap) + gap },
    { src: img3, x: gap, y: 2 * (img_height + gap) + gap },
    { src: img4, x: gap, y: 3 * (img_height + gap) + gap },
  ];
  const bgImages = [
    { src: bgImg1, alt: "1" },
    { src: bgImg2, alt: "2" },
  ];
  // ================= dummy data ================= //

  const canvasRef = useRef(null);
  const [bgChange, setBgChange] = useState();

  useEffect(() => {
    let now = new Date();
    const date_time = `${now.getFullYear()}.${now.getMonth()}.${now.getDate()} ${now.getHours()}:${now.getMinutes()}`;

    if (!canvasRef) return;
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, frame_width, frame_height);
    writeText(ctx, date_time);

    if (bgChange) {
      let img = new Image();
      img.src = bgChange;
      img.onload = function () {
        ctx.drawImage(img, 0, 0, frame_width, frame_height);
        writeText(ctx, date_time);
      };
    }

    images.map((image) => {
      let img = new Image();
      img.src = image.src;
      img.onload = function () {
        ctx.drawImage(img, image.x, image.y, img_width, img_height);
      };
    });
  }, [canvasRef, bgChange]);

  function writeText(ctx, text) {
    ctx.font = "25px sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.fillText(text, frame_width / 2, frame_height - 100);
  }

  const onUploadImg = (e) => {
    e.preventDefault();

    const canvas = document.getElementById("4cutImg");
    canvas.toBlob(
      function (blob) {
        const file = new File([blob], "4cut.jpeg", {
          lastModified: new Date().getTime(),
          type: blob.type,
        });
        const formData = new FormData();
        const config = {
          header: { "content-type": "multipart/form-data" },
        };
        formData.append("user-file", file);
        axios.post("/api/image/upload", formData, config).then((res) => {
          if (res.data.success) {
            console.log("업로드 성공!");
          } else {
            console.log("업로드 실패...");
          }
        });
      },
      "image/jpeg",
      1.0
    );
  };

  return (
    <div className={styles.container}>
      <h1>사진 수정</h1>
      <div>
        <button onClick={onUploadImg}>이미지 저장</button>
        {/* <h3>문구 수정</h3>
        <input id="input_text" type="text" placeholder="안 방 네 컷" /> */}
        <h3>배경 선택</h3>
        <div className={styles.bg_menu_scroll}>
          {bgImages.map((bgImage) => {
            return (
              <img
                src={bgImage.src}
                key={bgImage.alt}
                alt={bgImage.alt}
                onClick={() => setBgChange(bgImage.src)}
                width="100px"
                style={{ padding: "10px" }}
              ></img>
            );
          })}
        </div>
      </div>
      <div className={styles.img_container}>
        <canvas
          id="4cutImg"
          width={frame_width}
          height={frame_height}
          style={{
            backgroundColor: "black",
          }}
          ref={canvasRef}
        >
          Your browser does not support the HTML5 canvas tag.
        </canvas>
      </div>
    </div>
  );
}

export default PhotoEditPage;
