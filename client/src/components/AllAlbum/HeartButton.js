import React, { useState } from "react";
import axios from "axios";
import Heart from "react-animated-heart";

function HeartButton({ modalContent, setModalContent }) {
  const [totalLike, setTotalLike] = useState(modalContent.likes_count);
  const [like, setLike] = useState(modalContent.isLiked);
  const [isClick, setClick] = useState(like);

  const likeAction = () => {
    const params = {
      user: modalContent.user,
      imageId: modalContent.desc,
    };
    console.log('clicked1!');
    axios.patch(`/api/images/${modalContent.desc}/like`, params).then((res) => {
      setLike(!like);
      setTotalLike(res.data.likes.length);
    });
  };
  return (
    <div
      style={{
        justifyContent: "center",
        alignContent: "center",
        display: "flex",
        justifyItems: "center",
        alignItem: "center",
      }}
    >
      <Heart
        isClick={isClick}
        onClick={() => {
          setLike(!like);
          setClick(!isClick);
          likeAction();
        }}
      />

      <span
        style={{
          margin: "auto",
          marginLeft: -20,
          fontWeight: "bold",
          fontSize: "24px",
        }}
      >
        {totalLike}
      </span>
    </div>
  );
}

export default HeartButton;
