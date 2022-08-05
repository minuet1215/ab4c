import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Modal from "./Modal";
import styles from "./Album.module.css";
import axios from "axios";
import { auth } from "../../_actions/user_action";
import Loading from "../Loading/Loading";
import Header from "../Header/Header";

function MyAlbum() {
  const [loading, setLoading] = useState(true);
  const [clickedImg, setClickedImg] = useState(null);
  const [images, setImages] = useState([]);
  const [userId, setUserId] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const showModal = (contents) => {
    setClickedImg(contents);
    console.log("contents:", contents.isPublic);
  };

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(auth()).then((res) => {
      axios
        .post("/api/images/album/me", {
          id: res.payload._id,
          email: res.payload.email,
        })
        .then((result) => {
          setImages(result.data);
          setLoading(false);
          setUserId(res.payload._id);
        })
        .catch();
    });
  }, [dispatch, isModalVisible]);

  let data = { datas: [] };
  const url = process.env.REACT_APP_CLOUD_FRONT_URL;
  images.map((item) => {
    data.datas.push({
      desc: item._id,
      imageUrl: url + item.key,
      key: item.key,
      owner: item.user._id,

      user: userId,
      isLiked: item.likes.includes(userId),
      ownerName: item.user.name,
      likes: item.likes,
      likes_count: item.likes_count,
      isPublic: item.public,
    });
  });
  // console.log(data.datas);
  return (
    <div className="outer_container">
      <div>{loading ? <Loading /> : null}</div>
      <Header subTitle="사진첩" />
      <div className={styles.contents_container}>
        <div className={styles.album_container}>
          {data.datas.map((item, index) => (
            <div key={index} className={styles.img_container}>
              <img
                className={styles.wrap_img}
                src={item.imageUrl}
                alt={index}
                onClick={() => showModal(item)}
                loading="lazy"
              />
            </div>
          ))}
          <div>
            {clickedImg && (
              <Modal
                modalContent={clickedImg}
                setModalContent={setClickedImg}
                isModalVisible={isModalVisible}
                setModalVisible={setModalVisible}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyAlbum;
