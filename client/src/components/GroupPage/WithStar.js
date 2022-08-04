import styles from "./GroupPage.module.css";
import { useState, forwardRef } from "react";
import { starImages } from "./ImageSrc";

const WithStar = forwardRef((props, ref) => {
  let [withStar, setWithStar] = useState(null);
  function setImage(img) {
    let starImg = document.getElementById("myStar"); // socket.js 에서 id="myStar"인 img태그 불러옴
    if (withStar === img) {
      // 화면 이미지와 클릭한 이미지가 같으면 삭제
      setWithStar(null);
      starImg.src = 0;
    } else {
      setWithStar(img);
      starImg.src = img;
    }
  }

  return (
    <>
      {starImages.map((im, i) => {
        return (
          <img
            src={im.src}
            alt={im.alt}
            key={i}
            className={styles.tab_content_img_box}
            onClick={() => {
              setImage(im.src);
              ref.SocketMessageRef.current.emitStar(im.src);
            }}
          />
        );
      })}
    </>
  );
});
export default WithStar;
