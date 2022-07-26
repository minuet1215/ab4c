import styles from "./GroupPage.module.css";
import { useState } from "react";
import img1 from "../../img/bg1.jpeg";
import img2 from "../../img/bg2.jpeg";
import img3 from "../../img/bg3.jpeg";
import img4 from "../../img/bg4.jpeg";
import img5 from "../../img/bg5.jpg";
import img6 from "../../img/bg6.jpg";
import img7 from "../../img/bg7.jpg";
import img8 from "../../img/bg8.jpg";
import img9 from "../../img/bg9.jpg";
import img10 from "../../img/bg10.jpg";
import img11 from "../../img/bg11.jpg";
import img12 from "../../img/bg12.jpg";

// ==================== Dummy Data ====================== //
const images = [
  { src: img1, alt: "1" },
  { src: img2, alt: "2" },
  { src: img3, alt: "3" },
  { src: img4, alt: "4" },
  { src: img5, alt: "5" },
  { src: img6, alt: "6" },
  { src: img7, alt: "7" },
  { src: img8, alt: "8" },
  { src: img9, alt: "9" },
  { src: img10, alt: "10" },
  { src: img11, alt: "11" },
  { src: img12, alt: "12" },
];
// ====================================================== //
const BackgroundContent = (props) => {
  const [getImages, setImages] = useState(images);
  const handleChangeFile = (event) => {
    let reader = new FileReader();

    reader.onloadend = (e) => {
      // 2. 읽기가 완료되면 아래 코드 실행
      const base64 = reader.result;
      if (base64) {
        // 파일 base64 상태 업데이트
        // props.setImgBase64(base64.toString());
        images.unshift({ src: base64, alt: "userimage" });
        let copy = [...images];
        setImages(copy);
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
      {getImages.map((image, index) => {
        return (
          <img
            src={image.src}
            alt={image.alt}
            key={index}
            className={styles.tab_content_img_box}
            onClick={() => {
              props.setImgBase64(image.src);
            }}
          ></img>
        );
      })}
      <input
        type="file"
        id="input-file"
        style={{ display: "none" }}
        onChange={handleChangeFile}
      />
    </>
  );
};
export default BackgroundContent;
