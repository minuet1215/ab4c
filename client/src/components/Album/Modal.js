import React from "react";
import styles from "../AllAlbum/AllAlbum.module.css";
import HeartButton from "../AllAlbum/HeartButton";
import PhotoModify from "../ImageEditor/PhotoModify";
import PhotoDelete from "./PhotoDelete";

function Modal({ modalContent, setModalContent }) {
  const closeModal = () => {
    setModalContent(null);
  };
  return (
    <div className={styles.modal_background}>
      <div className={styles.modal_container}>
        <div className={styles.modal_header}>
          나의 안방네컷
        </div>
        <div className={styles.modal_img_container}>
          <img src={modalContent.imageUrl} className={styles.modal_img}></img>
        </div>
        <div className={styles.modal_control_container}>
          <HeartButton
            modalContent={modalContent}
            setModalContent={setModalContent}
          />
          <PhotoModify img={modalContent.imageUrl}/>
          <PhotoDelete img={modalContent}/>
          <button
            className="button"
            style={{ width: "50px", fontSize: "12px" }}
            onClick={() => closeModal()}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
