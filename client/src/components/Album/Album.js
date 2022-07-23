import React, { useState, useEffect } from "react";
import { Button } from "antd";
import { useDispatch } from "react-redux";
import data from "./images.json";
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
  const [images, setImages] = useState();
  const handleClick = (item, index) => {
    setCurrentIndex(index);
    setClickedImg(item.imageUrl);
  };

  const dispatch = useDispatch();
  /* 리팩토링 필요
   * useEffect 계속 적용 됨
   * 처음에 바로 userId를 못찾아냄.
   */
  useEffect(()=>{
    axios.get('/api/users/authen').then((response) => {
      setUserId(response.data._id);
    })
    console.log(userId)
    axios.post("/api/images/album/me", {id : userId})
    .then((result) => {
      setImages(result.data);
    })
  },[])
  console.log(images)

  // useEffect(() => {
  //   const getId = async () =>
  //     await dispatch(auth()).then((res) => {
  //       setUserId(res.payload._id);
  //       axios
  //         .post("/api/images/album/me", { id: userId })
  //         .then((result) => {
  //           setImages(result.data);
  //           return;
  //         })
  //         .catch((err) => console.log({ err }));
  //     });
  //   getId();
  // },[]);
  // console.log(images);

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
                alt={item.desc}
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
