import React, { useState, useEffect } from "react";
import { Button } from "antd";
import { useDispatch } from "react-redux";
import data from "./images.json";
import Modal from "./Modal/Modal";
import Header from "../Header/Header";
import PhotoModify from "../ImageEditor/PhotoModify";
import "./style.css";
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
  useEffect(() => {
    const getId = async () =>
      await dispatch(auth()).then((res) => {
        setUserId(res.payload._id);
        axios
          .post("/api/images/album/me", { id: userId })
          .then((result) => {
            setImages(result.data);
            return;
          })
          .catch((err) => console.log({ err }));
      });
    getId();
  });

  // 모달창에서 앞뒤로 이동하기
  const handleRotationRight = () => {
    const totalLength = data.data.length;
    if (currentIndex + 1 >= totalLength) {
      setCurrentIndex(0);
      const newUrl = data.data[0].imageUrl;
      setClickedImg(newUrl);
      return;
    }
    const newIndex = currentIndex + 1;
    const newUrl = data.data.filter((item) => {
      return data.data.indexOf(item) === newIndex;
    });
    const newItem = newUrl[0].imageUrl;
    setClickedImg(newItem);
    setCurrentIndex(newIndex);
  };

  const handleRotationLeft = () => {
    const totalLength = data.data.length;
    if (currentIndex === 0) {
      setCurrentIndex(totalLength - 1);
      const newUrl = data.data[totalLength - 1].imageUrl;
      setClickedImg(newUrl);
      return;
    }
    const newIndex = currentIndex - 1;
    const newUrl = data.data.filter((item) => {
      return data.data.indexOf(item) === newIndex;
    });
    const newItem = newUrl[0].imageUrl;
    setClickedImg(newItem);
    setCurrentIndex(newIndex);
  };

  return (

    <div className="container">
      <Header />
      <div className="contents_container">
        <div className="wrapper">
          {data.data.map((item, index) => (
            <div key={index} className="wrapper-images">
              <img
                src={item.link}
                alt={item.text}
                onClick={() => handleClick(item, index)}
              />
              <div>
                <PhotoModify img={item.link} />
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
