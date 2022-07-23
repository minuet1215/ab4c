import React from "react";
import { Button } from "antd";
import axios from "axios";
import {toast} from "react-toastify"

function PhotoDelete(props) {
  const deleteHandler = async () => {
    axios.delete("/api/images/album/delete/", { data: props }).then((res) => {
        toast.success(res.message)
    }).catch((err) => toast.error(err.message));
  };
  return <Button onClick={deleteHandler}>삭제하기</Button>;
}
export default PhotoDelete;
