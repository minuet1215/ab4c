import React from "react";
import { useNavigate } from "react-router-dom";

function PhotoModify(props) {
  const navigate = useNavigate();

  const modifyHandler = () => {
    navigate("/editPhoto", { state: { path: props.img } });
  };
  return (
    <button
      className="edit_btn"
      onClick={modifyHandler}
      style={{ margin: "5px" }}
    >
      수정
    </button>
  );
}
export default PhotoModify;
