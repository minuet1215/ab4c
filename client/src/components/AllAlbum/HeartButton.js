import React, { useState, useEffect } from "react";
import axios from "axios";
import Loading from "../Loading/Loading";

function HeartButton({ modalContent, setModalContent }) {
  // const [totalLike, setTotalLike] = useState(0);
  const [like, setLike] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user_id, setUser_id] = useState("");

  useEffect(() => {
    axios.get("/api/users/authen").then(async (response) => {
      setUser_id(response.data._id); // _id : ObjectID
      axios.get(`/api/images/${modalContent.desc}/${user_id}`).then((res) => {
        console.log(res.data.isLiked);
        if (res.data.isLiked === true) setLike(true);
        setLoading(false);
      });
    }, []);
  }, [user_id, like]);

  const likeAction = () => {
    const params = {
      user: user_id,
      imageId: modalContent.desc,
    };

    axios.patch(`/api/images/${modalContent.desc}/like`, params).then((res) => {
      setLike(!like);
      // setTotalLike(res.data.likes_count);
    });
  };

  return (
    <>
      <div>{loading ? <Loading /> : null}</div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="30"
        height="30"
        fill="currentColor"
        viewBox="0 0 16 16"
      >
        {/* <h3>{totalLike}</h3> */}
        <path
          d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"
          fill={like ? "#fc8da1" : "#959595"}
          onClick={() => likeAction()}
        />
      </svg>
    </>
  );
}

export default HeartButton;
