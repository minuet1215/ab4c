import React, { useEffect, useState } from "react";
import styles from "./AllAlbum.module.css";
import HeartButton from "./HeartButton";

function Modal({ modalContent, setModalContent }) {
  const closeModal = () => {
    setModalContent(null);
  };
  return (
    <div className={styles.modal_background}>
      <div className={styles.modal_container}>
        <div className={styles.modal_header}>{modalContent.ownerName}</div>
        <div className={styles.modal_img_container}>
          <img src={modalContent.imageUrl} className={styles.modal_img}></img>
        </div>
        <div className={styles.modal_control_container}>
          <HeartButton
            modalContent={modalContent}
            setModalContent={setModalContent}
          />
          <button
            className="button"
            style={{ width: "100px" }}
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
