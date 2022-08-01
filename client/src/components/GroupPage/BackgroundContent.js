import styles from "./GroupPage.module.css";
import React, { useState, useEffect } from "react";
import { auth } from "../../_actions/user_action";
import axios from "axios";
import { useDispatch } from "react-redux";
// import ProgressBar from "../ProgressBar/ProgressBar";

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
import 단색1 from "../../img/단색1.png";
import 단색2 from "../../img/단색2.png";
import 단색3 from "../../img/단색3.png";
import 단색4 from "../../img/단색4.png";
import 단색5 from "../../img/단색5.png";
import 단색6 from "../../img/단색6.png";
import 파스텔1 from "../../img/파스텔1.jpg";
import 파스텔2 from "../../img/파스텔2.jpg";
import 파스텔3 from "../../img/파스텔3.jpg";
import 파스텔4 from "../../img/파스텔4.jpg";
import 파스텔5 from "../../img/파스텔5.png";

// ==================== Dummy Data ====================== //
const images = [
  { src: 파스텔1, alt: "파스텔1" },
  { src: 파스텔2, alt: "파스텔2" },
  { src: 파스텔3, alt: "파스텔3" },
  { src: 파스텔4, alt: "파스텔4" },
  { src: 파스텔5, alt: "파스텔5" },
  { src: 단색1, alt: "단색1" },
  { src: 단색2, alt: "단색2" },
  { src: 단색3, alt: "단색3" },
  { src: 단색4, alt: "단색4" },
  { src: 단색5, alt: "단색5" },
  { src: 단색6, alt: "단색6" },
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
  const [myImages, setMyImages] = useState([]);
  const [me, setMe] = useState("");
  const dispatch = useDispatch();
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    dispatch(auth()).then((res) => {
      axios
        .get(`/api/bg/show/${res.payload._id}`)
        .then((result) => {
          setMyImages([...result.data]);
          setMe(res.payload);
        })
        .catch();
    });
  }, [dispatch, percent]);

  const handleChangeFile = async (event) => {
    const formData = new FormData();

    formData.append("id", me._id);
    formData.append("email", me.email);
    formData.append("name", me.name);
    formData.append("image", event.target.files[0]);

    axios.post("/api/bg/post", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (e) => {
        setPercent(Math.round((100 * e.loaded) / e.total));
      },
    });

    setTimeout(() => {
      setPercent(0);
    }, 3000);
  };

  return (
    <>
      <label className={styles.tab_content_input_box} htmlFor="input-file">
        {/* <ProgressBar Bar percent={percent} /> */}
        +
      </label>

      <input
        type="file"
        id="input-file"
        style={{ display: "none" }}
        onChange={handleChangeFile}
      />

      {myImages.map((image, index) => {
        return (
          <img
            src={process.env.REACT_APP_CLOUD_FRONT_URL + image.key}
            key={index}
            className={styles.tab_content_img_box}
            alt=""
            onClick={() => {
              props.setImgBase64(process.env.REACT_APP_CLOUD_FRONT_URL + image.key);
            }}
          ></img>
        );
      })}

      {images.map((image, index) => {
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
    </>
  );
};
export default BackgroundContent;
