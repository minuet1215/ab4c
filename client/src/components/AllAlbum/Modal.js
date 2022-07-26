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
        <div className={styles.modal_header}>
          {modalContent.ownerName} 님의 안방네컷 {/* &nbsp; */}
          {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            fill="currentColor"
            class="bi bi-camera-fill"
            viewBox="0 0 16 16"
          >
            <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
            <path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0z" />
          </svg> */}
        </div>
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
