import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { auth } from "../../_actions/user_action";
import Loading from "../Loading/Loading";
import styles from "./AllAlbum.module.css";
import Modal from "./Modal";
import AutoSlides from "./AutoSlides";
import MyHeader from "../Header/Header";

const url = process.env.REACT_APP_CLOUD_FRONT_URL;

function AllAlbum() {
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const dispatch = useDispatch();
  const [userId, setUserId] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    dispatch(auth()).then((res) => {
      axios
        .post("/api/images/album", { id: res.payload._id })
        .then((result) => {
          setUserId(res.payload._id);
          setImages(result.data);
          setLoading(false);
        })
        .catch();
    });
  }, [dispatch, isModalVisible]);

  let data = { datas: [] };

  images.map((item) => {
    data.datas.push({
      desc: item._id,
      imageUrl: url + item.key,
      key: item.key,
      owner: item.user._id,
      
      // modal용 데이터
      ownerName: item.user.name,
      ownerEmail : item.user.email,
      likes: item.likes,
      user: userId,
      isLiked: item.likes.includes(userId),
      likes_count: item.likes_count,
    });                                                                                                                                                                                        
  });

  const [modalContent, setModalContent] = useState(null);
  const showModal = (contents) => {
    setModalContent(contents);
  };

  return (
    <div className="outer_container">
      <div>{loading ? <Loading /> : null}</div>
      <MyHeader subTitle="전체 앨범" />
      {/* <div className={styles.contents_container}> */}
      <div className={styles.album_container}>
        <AutoSlides />
        {data.datas.map((item, index) => (
          <div key={index} className={styles.img_container}>
            <img
              className={styles.wrap_img}
              src={item.imageUrl}
              alt={index}
              onClick={() => showModal(item)}
              style={{
                cursor: "pointer",
              }}
            />
          </div>
        ))}
      </div>
      {modalContent && (
        <Modal
          modalContent={modalContent}
          setModalContent={setModalContent}
          isModalVisible={isModalVisible}
          setModalVisible={setModalVisible}
        />
      )}
    </div>
    // </div>
  );
}

export default AllAlbum;
