import React, { useState, useEffect } from "react";
import axios from "axios";

function HeartButton({ modalContent, setModalContent }) {
  const [totalLike, setTotalLike] = useState(0);
  const [like, setLike] = useState(modalContent.isLiked);

  const likeAction = () => {
    const params = {
      user: modalContent.user,
      imageId: modalContent.desc,
    };

    axios.patch(`/api/images/${modalContent.desc}/like`, params).then((res) => {
      setLike(!like);
      setTotalLike(res.data.likes.length);
    });
  };

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="30"
        height="30"
        fill="currentColor"
        viewBox="0 0 16 16"
      >
        <path
          d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"
          fill={like ? "#fc8da1" : "#959595"}
          onClick={likeAction}
        />
      </svg>
    </>
  );
}

export default HeartButton;
