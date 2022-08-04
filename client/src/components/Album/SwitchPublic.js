import React from "react";
import axios from "axios";
// import { toast } from "react-toastify";

function SwitchPublic(props) {
  const publicHandler = async () => {
    // const confirmDelete = window.confirm("삭제 하시겠습니까?");
    if (confirmDelete === true) {
      axios
        .delete("/api/images/album/public/", { data: props })
        .then((res) => {
          window.location.replace("/album");
        })
        .catch((err) => toast.error("서버 에러!"));
    }
  };
  return (
    <button className="PubBtn" onClick={publicHandler}>
      공개
    </button>
  );
}
export default SwitchPublic;
