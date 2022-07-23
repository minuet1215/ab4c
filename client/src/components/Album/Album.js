import React, { useState, useEffect } from "react";
import { Button } from "antd";
import { useDispatch } from "react-redux";
// import data from "./images.json";
import Modal from "./Modal/Modal";
import Header from "../Header/Header";
import PhotoModify from "../ImageEditor/PhotoModify";
import styles from "./Album.module.css";
import axios from "axios";
import { auth } from "../../_actions/user_action";

function MyAlbum() {
  const [clickedImg, setClickedImg] = useState(null);
  const [userId, setUserId] = useState("");
  const [currentIndex, setCurrentIndex] = useState(null);
  const [images, setImages] = useState([]);
  const handleClick = (item, index) => {
    setCurrentIndex(index);
    setClickedImg(item.imageUrl);
  };
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(auth()).then((res)=>{
      axios.post("/api/images/album/me", {id :res.payload._id})
      .then((result) => {
        setImages(result.data)
      })
      .catch((err) => console.log({err}))
    })
  },[])

  let data = {"datas" : []}
  const url = "https://ab4c-image-bucket.s3.ap-northeast-2.amazonaws.com/"
  const myImgs = images.map((item) => {
    data.datas.push({"desc" : item._id, "imageUrl" : url+item.key})
  })
  
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
    <div className="container">
      <Header />
      <div className={styles.contents_container}>
        <div className={styles.wrapper}>
          {data.datas.map((item, index) => (
            <div key={index} className={styles.wrapper_images}>
              <img
                className={styles.wrap_img}
                src={item.imageUrl}
                alt={index}
                onClick={() => handleClick(item, index)}
                loading="lazy"
              />
              <div>
                <PhotoModify img={item.imageUrl} />
                <Button>삭제하기</Button>
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
