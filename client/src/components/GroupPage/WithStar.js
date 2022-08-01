import styles from "./GroupPage.module.css";
import { useState, forwardRef } from "react";
import { BackgroundRemoval, Nooki } from "./Nooki.js";
import Jin from "./NookiImages/Jin01.png";
import Jennie from "./NookiImages/Jennie01.png";
import Shj from "./NookiImages/SeoHyunJin01.png";
import BtsV from "./NookiImages/V01.png";
import Winter from "./NookiImages/Winter01.png";
import hat1 from "../../img/hat1.png";
import hat2 from "../../img/hat2.png";
import hat3 from "../../img/hat3.png";
import hat4 from "../../img/hat4.png";
import hat5 from "../../img/hat5.png";
const starImages = [
  { src: Jin, alt: "1" },
  { src: Jennie, alt: "2" },
  { src: Shj, alt: "3" },
  // { src: Suzi, alt: "4" },
  { src: BtsV, alt: "5" },
  { src: Winter, alt: "6" },
  { src: hat1, alt: "hat1" },
  { src: hat2, alt: "hat2" },
  { src: hat3, alt: "hat3" },
  { src: hat4, alt: "hat4" },
  { src: hat5, alt: "hat5" },
];
const WithStar = forwardRef((props, ref) => {
  let [withStar, setWithStar] = useState(null);

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
          ctx.drawImage(
            ogImg,
            0,
            canvas.height / 5,
            canvas.width / 2,
            (canvas.height / 5) * 4
          );
          BackgroundRemoval(canvas);
          Nooki(canvas, ctx);
        };
      }
    };
    if (event.target.files[0]) {
      // 1. 파일을 읽어 버퍼에 저장
      reader.readAsDataURL(event.target.files[0]);
    }
  };
  function setImage(img) {
    // let canvas = document.getElementById("myStar");
    let starImg = document.getElementById("myStar");
    // let ctx = canvas.getContext("2d");
    if (withStar === img) {
      setWithStar(null);
      starImg.src = 0;
      // ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else {
      if (withStar !== null) {
        // ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      setWithStar(img);

      // let star = new Image();
      starImg.src = img;
      // star.onload = () => {
      //   canvas.width = ref.captureAreaRef.current.clientWidth;
      //   canvas.height = ref.captureAreaRef.current.clientHeight;
      //   ctx.drawImage(star, 0, 0, canvas.width / 3, canvas.height / 3);
      // };
    }
  }

  return (
    <>
      <label className={styles.tab_content_input_box} htmlFor="input-file">
        +
      </label>
      {starImages.map((im, i) => {
        return (
          <img
            src={im.src}
            alt={im.alt}
            key={i}
            className={styles.tab_content_img_box}
            onClick={() => {
              setImage(im.src);
            }}
          />
        );
      })}
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
