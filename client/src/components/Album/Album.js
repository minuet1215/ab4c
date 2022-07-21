import React, { useState } from "react";
import { Button } from "antd";
import data from "./images.json";
import Modal from "./Modal/Modal";
import Header from "../Header/Header";
import PhotoModify from "../ImageEditor/PhotoModify";
import "./style.css";
function MyAlbum() {
  const [clickedImg, setClickedImg] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  const handleClick = (item, index) => {
    setCurrentIndex(index);
    setClickedImg(item.link);
  };


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
    <Header/>
    <div className="wrapper">
      {data.data.map((item, index) => (
        <div key={index} className="wrapper-images">
          <img
            src={item.link}
            alt={item.text}
            onClick={() => handleClick(item, index)}
          />
          <div>
          <PhotoModify img={item.link}/>
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
