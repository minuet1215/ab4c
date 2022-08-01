import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

function PhotoModify(props) {
  const navigate = useNavigate();

  const modifyHandler = () => {
    navigate("/editPhoto", { state: { path: props.img } });
  };
  return (
    <button className="button EditBtn" onClick={modifyHandler}>
      수정
    </button>
  );
}
export default PhotoModify;
