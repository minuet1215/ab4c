import styles from "./GroupPage.module.css";
import { useState, forwardRef } from "react";
import { BackgroundRemoval, Nooki } from "./Nooki.js";
import Jin from "./NookiImages/Jin01.png";
import Jennie from "./NookiImages/Jennie01.png";
import Shj from "./NookiImages/SeoHyunJin01.png";
import BtsV from "./NookiImages/V01.png";
import Winter from "./NookiImages/Winter01.png";
import hat1 from "./NookiImages/hat1.png";
import hat2 from "./NookiImages/hat2.png";
import hat3 from "./NookiImages/hat3.png";
import hat4 from "./NookiImages/hat4.png";
import hat5 from "./NookiImages/hat5.png";
import starbg1 from "./NookiImages/starbg1.png";
import starbg2 from "./NookiImages/starbg2.png";
import starbg3 from "./NookiImages/starbg3.png";
import starbg4 from "./NookiImages/starbg4.png";
import starbg5 from "./NookiImages/starbg5.png";
import starbg6 from "./NookiImages/starbg6.png";
import starbg7 from "./NookiImages/starbg7.png";
import starbg8 from "./NookiImages/starbg8.png";
import starbg9 from "./NookiImages/starbg9.png";
import starbg10 from "./NookiImages/starbg10.png";
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
  { src: starbg1, alt: "starbg1" },
  { src: starbg2, alt: "starbg2" },
  { src: starbg3, alt: "starbg3" },
  { src: starbg4, alt: "starbg4" },
  { src: starbg5, alt: "starbg5" },
  { src: starbg6, alt: "starbg6" },
  { src: starbg7, alt: "starbg7" },
  { src: starbg8, alt: "starbg8" },
  { src: starbg9, alt: "starbg9" },
  { src: starbg10, alt: "starbg10" },
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
