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
    setClickedImg(item.imageUrl);
  };

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
    <>
      <Header />
      <div className="albumBackground">
        <div className="wrapper">
          {data.data.map((item, index) => {
            const { desc, imageUrl } = item;
        
            return (
              <div key={index} className="wrapper-images">
                <img
                  src={imageUrl}
                  alt={desc}
                  onClick={() => handleClick(item, index)}
                  className="card-img-top"
                />
                <div>
                  <PhotoModify img={imageUrl} />
                  <Button>삭제하기</Button>
                </div>
              </div>
            );
          })}
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
    </>
  );
}

export default MyAlbum;
