import React from "react";
import styles from "./AllAlbum.module.css";
import HeartButton from "./HeartButton";
import axios from "axios";
import { toast } from "react-toastify";

function Modal({
  modalContent,
  setModalContent,
  isModalVisible,
  setModalVisible,
}) {
  const owner = modalContent.owner;
  const user = modalContent.user;

  const closeModal = () => {
    setModalContent(null);
    setModalVisible(!isModalVisible);
  };

  const addFriend = async () => {
    const body = {
      id: modalContent.user,
    };
    axios
      .post(`/api/friends/add/${modalContent.ownerEmail}`, body)
      .then((response) => {
        if (response.data.success) {
          toast.success("추가되었습니다.");
        } else {
          toast.error("이미 추가된 친구입니다.");
        }
      });
  };

  return (
    <div className={styles.modal_background}>
      <div className={styles.modal_container}>
        <div className={styles.modal_header}>
          {modalContent.ownerName}님의 안방네컷
        </div>
        <div className={styles.modal_img_container}>
          <img
            src={modalContent.imageUrl}
            className={styles.modal_img}
            alt=""
          ></img>
        </div>
        <div
          className={styles.modal_control_container}
          style={{ whiteSpace: "nowrap" }}
        >
          <HeartButton
            modalContent={modalContent}
            setModalContent={setModalContent}
          />
          {owner !== user && (
            <button
              className="button btn_1"
              style={{ width: "9vh", height: "5vh", fontSize: "1.5vh" }}
              onClick={() => addFriend()}
            >
              친구추가
            </button>
          )}

          <button
            className="button"
            style={{ width: "9vh", height: "5vh", fontSize: "1.5vh" }}
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
