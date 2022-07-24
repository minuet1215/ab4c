import React, { useState, useEffect } from "react";
import axios from "axios";

function HeartButton({ modalContent, setModalContent }) {
  const [like, setLike] = useState(false);
  const [user_id, setUser_id] = useState("");

  useEffect(() => {
    axios.get("/api/users/authen").then((response) => {
      setUser_id(response.data._id); // _id : ObjectID
    });

    modalContent.likes.map((item) => {
      if (item.user._id === user_id) {
        setLike(true);
      }
    });
  }, [like]);

  const likeAction = () => {
    const params = {
      user: user_id,
      imageId: modalContent.desc,
    };
    axios.patch(`/api/images/${modalContent.desc}/like`, params).then((res) => {
      setLike(!like);
    });
  };

  return (
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
        onClick={() => likeAction()}
      />
    </svg>
  );
}

export default HeartButton;
