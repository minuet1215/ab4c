import React from "react";
import { Button } from "antd";
import axios from "axios";
import { toast } from "react-toastify";

function PhotoDelete(props) {
  const deleteHandler = async () => {
    const confirmDelete = window.confirm("삭제 하시겠습니까?");
    if (confirmDelete === true) {
      axios
        .delete("/api/images/album/delete/", { data: props })
        .then((res) => {
          return toast.success(res.data.message);
        })
        .catch((err) => toast.error(err.message));
    }
  };
  return (
    <button className="AlbumBtn DelBtn" onClick={deleteHandler}>
      삭제
    </button>
  );
}
export default PhotoDelete;
