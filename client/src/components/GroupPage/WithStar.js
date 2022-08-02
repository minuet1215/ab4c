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
  function setImage(img) {
    let starImg = document.getElementById("myStar");
    if (withStar === img) {
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
