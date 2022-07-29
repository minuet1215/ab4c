import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Modal from "./Modal/Modal";
import Header from "../Header/Header";
import PhotoModify from "../ImageEditor/PhotoModify";
import PhotoDelete from "./PhotoDelete";
import styles from "./Album.module.css";
import axios from "axios";
import { auth } from "../../_actions/user_action";
import Loading from "../Loading/Loading";

function MyAlbum() {
  const [loading, setLoading] = useState(true);
  const [clickedImg, setClickedImg] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [images, setImages] = useState([]);
  const handleClick = (item, index) => {
    setCurrentIndex(index);
    setClickedImg(item.imageUrl);
  };
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(auth()).then((res) => {
      axios
        .post("/api/images/album/me", { id: res.payload._id })
        .then((result) => {
          setImages(result.data);
          setLoading(false);
        })
        .catch();
    });
  }, [images]);

  let data = { datas: [] };
  const url = "https://d2d88axq88qldt.cloudfront.net/";
  images.map((item) => {
    data.datas.push({
      desc: item._id,
      imageUrl: url + item.key,
      key: item.key,
      owner: item.user._id,
    });
    return data;
  });

  // 모달창에서 앞뒤로 이동하기
  const handleRotationRight = () => {
    const totalLength = data.datas.length;
    if (currentIndex + 1 >= totalLength) {
      setCurrentIndex(0);
      const newUrl = data.datas[0].imageUrl;
      setClickedImg(newUrl);
      return;
    }
    const newIndex = currentIndex + 1;
    const newUrl = data.datas.filter((item) => {
      return data.datas.indexOf(item) === newIndex;
    });
    const newItem = newUrl[0].imageUrl;
    setClickedImg(newItem);
    setCurrentIndex(newIndex);
  };

  const handleRotationLeft = () => {
    const totalLength = data.datas.length;
    if (currentIndex === 0) {
      setCurrentIndex(totalLength - 1);
      const newUrl = data.datas[totalLength - 1].imageUrl;
      setClickedImg(newUrl);
      return;
    }
    const newIndex = currentIndex - 1;
    const newUrl = data.datas.filter((item) => {
      return data.datas.indexOf(item) === newIndex;
    });
    const newItem = newUrl[0].imageUrl;
    setClickedImg(newItem);
    setCurrentIndex(newIndex);
  };

  return (
    <div className="outer_container">
      <div>{loading ? <Loading /> : null}</div>
      <Header subTitle="내 앨범" onBackUrl="/main" />
      <div className={styles.contents_container}>
        <div className={styles.album_container}>
          {data.datas.map((item, index) => (
            <div key={index} className={styles.img_container}>
              <img
                className={styles.wrap_img}
                src={item.imageUrl}
                alt={index}
                onClick={() => handleClick(item, index)}
                loading="lazy"
              />
              <div className={styles.submit_btns}>
                <PhotoModify img={item.imageUrl} />
                <PhotoDelete img={item} />
              </div>
            </div>
          ))}
          <div>
            {clickedImg && (
              <Modal
                clickedImg={clickedImg}
                handleRotationRight={handleRotationRight}
                setClickedImg={setClickedImg}
                handleRotationLeft={handleRotationLeft}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyAlbum;
