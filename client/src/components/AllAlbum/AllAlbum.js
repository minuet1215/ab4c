import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Header from "../Header/Header";
import axios from "axios";
import { auth } from "../../_actions/user_action";
import Loading from "../Loading/Loading";

const url = "https://ab4c-image-bucket.s3.ap-northeast-2.amazonaws.com/";

function AllAlbum() {
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(auth()).then((res) => {
      axios
        .post("/api/images/album", { id: res.payload._id })
        .then((result) => {
          setImages(result.data);
          setLoading(false);
        })
        .catch((err) => console.log({ err }));
    });
  }, [images]);

  let data = { datas: [] };

  images.map((item) => {
    data.datas.push({
      desc: item._id,
      imageUrl: url + item.key,
      key: item.key,
      owner: item.user._id,
    });
  });

  return (
    <>
      <div className="container">
        <div>{loading ? <Loading /> : null}</div>
        <Header />
        {data.datas.map((item, index) => (
          <div key={index}>
            <img src={item.imageUrl} alt={index} />
          </div>
        ))}
      </div>
    </>
  );
}

export default AllAlbum;
