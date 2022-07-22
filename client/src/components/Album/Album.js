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
    setClickedImg(item.link);
  };
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(auth()).then((res) => {
      setUserId(res.payload._id);
    });
    console.log(userId);
    axios
      .post("/api/images/album/me", userId)
      .then((result) => {
        setImages(result.data);
        // console.log(result.data);
      })
      .catch((err) => console.log({ err }));
  }, []);

  // 모달창에서 앞뒤로 이동하기
  const handleRotationRight = () => {
    const totalLength = data.data.length;
    if (currentIndex + 1 >= totalLength) {
      setCurrentIndex(0);
      const newUrl = data.data[0].link;
      setClickedImg(newUrl);
      return;
    }
    const newIndex = currentIndex + 1;
    const newUrl = data.data.filter((item) => {
      return data.data.indexOf(item) === newIndex;
    });
    const newItem = newUrl[0].link;
    setClickedImg(newItem);
    setCurrentIndex(newIndex);
  };

  const handleRotationLeft = () => {
    const totalLength = data.data.length;
    if (currentIndex === 0) {
      setCurrentIndex(totalLength - 1);
      const newUrl = data.data[totalLength - 1].link;
      setClickedImg(newUrl);
      return;
    }
    const newIndex = currentIndex - 1;
    const newUrl = data.data.filter((item) => {
      return data.data.indexOf(item) === newIndex;
    });
    const newItem = newUrl[0].link;
    setClickedImg(newItem);
    setCurrentIndex(newIndex);
  };

  return (
    <>
      <Header />
      <img
        src="https://ab4c-image-bucket.s3.ap-northeast-2.amazonaws.com/images/2c3aa8aa-67c2-425a-9785-a8993951c0ab.jpeg"
        alt="안방네컷"
      />
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
    </>
  );
}

export default MyAlbum;
