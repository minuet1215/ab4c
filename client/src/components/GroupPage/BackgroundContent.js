import styles from "./GroupPage.module.css";
import React, { useState, forwardRef } from "react";
import { bgImages } from "./ImageSrc";

const BackgroundContent = forwardRef((props, ref) => {
  const [getImages, setImages] = useState(bgImages);
  const handleChangeFile = (event) => {
    let reader = new FileReader();

    reader.onloadend = (e) => {
      // 2. 읽기가 완료되면 아래 코드 실행
      const base64 = reader.result;
      if (base64) {
        // 파일 base64 상태 업데이트
        // props.setImgBase64(base64.toString());
        bgImages.unshift({ src: base64, alt: "userimage" });
        let copy = [...bgImages];
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
          />
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
});
export default BackgroundContent;
