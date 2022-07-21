import React, { useRef, useEffect, useState } from "react";
import { useLocation } from "react-router";
import axios from "axios";
import styles from "./PhotoEditPage.module.css";
import MyHeader from "../Header/Header";
import { Drawer } from "antd";
import defaultBg from "../../img/default_background.jpg";
import bgImg2 from "../../img/6.jpg";
const img_width = 550;
const img_height = 370;
const gap = 20;
const frame_width = img_width + 2 * gap;
const frame_height = 4 * (img_height + gap) + 300;

function PhotoEditPage() {
  const [isPublic, SetIsPublic] = useState(true);

  const { state } = useLocation();
  // ================= dummy data ================= //
  const images = [
    { src: state.images[state.images.length - 4], x: gap, y: gap },
    {
      src: state.images[state.images.length - 3],
      x: gap,
      y: 1 * (img_height + gap) + gap,
    },
    {
      src: state.images[state.images.length - 2],
      x: gap,
      y: 2 * (img_height + gap) + gap,
    },
    {
      src: state.images[state.images.length - 1],
      x: gap,
      y: 3 * (img_height + gap) + gap,
    },
  ];
  const bgImages = [
    { src: defaultBg, alt: "default" },
    { src: bgImg2, alt: "spring" },
  ];
  // ================= dummy data ================= //

  const canvasRef = useRef(null);
  const [bgChange, setBgChange] = useState(defaultBg);
  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  useEffect(() => {
    let now = new Date();
    const date_time = `${now.getFullYear()}.${now.getMonth()}.${now.getDate()} ${now.getHours()}:${now.getMinutes()}`;

    if (!canvasRef) return;
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, frame_width, frame_height);
    writeText(ctx, date_time);

    let img = new Image();
    img.src = bgChange;
    img.onload = function () {
      ctx.drawImage(img, 0, 0, frame_width, frame_height);
      writeText(ctx, date_time);
      images.map((image) => {
        let img = new Image();
        img.src = image.src;
        img.onload = function () {
          ctx.drawImage(img, image.x, image.y, img_width, img_height);
        };
      });
    };
  }, [canvasRef, bgChange, visible]);

  function writeText(ctx, text) {
    ctx.font = "25px sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.fillText(text, frame_width / 2, frame_height - 100);
  }


  // save to local
  const OnSave = () => {
    let now = new Date();
    const date_time = `${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}_${now.getHours()}${now.getMinutes()}`;
    const canvas = document.getElementById("canvas");
    const dataUrl = canvas.toDataURL();
    const filename = "4cut_" + date_time + ".png";
    let link = document.createElement("a");
    if (typeof link.download === "string") {
      link.href = dataUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open(dataUrl);
    }
  };

  const forTest = (e) => {
    e.preventDefault();

    const canvas = document.getElementById("canvas");
    canvas.toBlob(
      async function (blob) {
        const file = new File([blob], "4cut.png", {
          lastModified: new Date().getTime(),
          type: blob.type,
        });
        const formData = new FormData();

        formData.append("file", file);
        await axios.post("/api/images/test", formData).then((res) => {
          if (res) {
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
    <div className="container">
      <MyHeader subTitle="사진 화면" onBackUrl="/" />
      <div className="contents_container">
        <div className={styles.canvas_container}>
          <canvas
            id="canvas"
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
        <div id="control-menu" className={styles.control_container}>
          <button className={styles.btn_default}>공유</button>
          <button className={styles.btn_default} onClick={showDrawer}>
            프레임 변경
          </button>
          <button className={styles.btn_pink} onClick={OnSave}>
            저장
          </button>

          <form onSubmit={forTest}>
            <input
              type="checkbox"
              id="public-check"
              value={!isPublic}
              onChange={() => SetIsPublic(!isPublic)}
            ></input>
            <label htmlFor="public-check">비공개</label>
            <button
              type="submit"
              style={{
                width: "100%",
                height: 30,
                borderRadius: 3,
                cursor: "pointer",
              }}
            >
              test
            </button>
          </form>
        </div>

        <Drawer
          title="프레임 선택"
          placement="bottom"
          closable={true}
          onClose={onClose}
          visible={visible}
          height="30%"
        >
          <div className={styles.bg_menu_scroll}>
            {bgImages.map((bgImage) => {
              return (
                <img
                  src={bgImage.src}
                  key={bgImage.alt}
                  alt={bgImage.alt}
                  onClick={() => setBgChange(bgImage.src)}
                  width="100px"
                  height="150px"
                  style={{ padding: "10px" }}
                ></img>
              );
            })}
          </div>
        </Drawer>
      </div>
    </div>
  );
}

export default PhotoEditPage;
