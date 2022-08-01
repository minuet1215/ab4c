import React from "react";
import axios from "axios";
import { toast } from "react-toastify";

function PhotoDelete(props) {
  const deleteHandler = async () => {
    const confirmDelete = window.confirm("삭제 하시겠습니까?");
    if (confirmDelete === true) {
      axios
        .delete("/api/images/album/delete/", { data: props })
        .then((res) => {
          window.location.replace('/album');
        })
        .catch((err) => toast.error("서버 에러!"));
    }
  };
  return (
    <button className="DelBtn" onClick={deleteHandler}>
      삭제
    </button>
  );
}
export default PhotoDelete;
