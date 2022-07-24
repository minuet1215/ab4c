import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Header from "../Header/Header";
import axios from "axios";
import { auth } from "../../_actions/user_action";
import Loading from "../Loading/Loading";
import styles from "./AllAlbum.module.css";
import Modal from "./Modal";

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
      // modal용 데이터
      ownerName: item.user.name,
      likes: item.likes,
    });
  });

  const [modalContent, setModalContent] = useState(null);
  const showModal = (contents) => {
    setModalContent(contents);
  };

  return (
    <>
      <div className="outer_container">
        <div>{loading ? <Loading /> : null}</div>
        <Header />
        <div className={styles.album_container}>
          {data.datas.map((item, index) => (
            <div key={index} className={styles.img_container}>
              <img
                src={item.imageUrl}
                alt={index}
                onClick={() => showModal(item)}
              />
            </div>
          ))}
        </div>
        {modalContent && (
          <Modal
            modalContent={modalContent}
            setModalContent={setModalContent}
          />
        )}
      </div>
    </>
  );
}

export default AllAlbum;
