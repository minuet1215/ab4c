import React, { useState } from "react";
import { Switch } from "antd";
import axios from "axios";
import { toast } from "react-toastify";

function SwitchPublic(modalContent) {
  const [isPublic, setIsPublic] = useState(modalContent.isPublic); // true가 공개라면

  const publicHandler = (checked) => {
    axios
      .patch("/api/images/album/public/", modalContent)
      .then((res) => {
        setIsPublic(!isPublic);
      })
      .catch((err) => toast.error(err.message));
  };
  return (
    <>
      <Switch defaultChecked onChange={publicHandler} />
      {/* <button
        className="PubBtn"
        onClick={() => {
          publicHandler();
        }}
      > */}
      공개
      {/* </button> */}
    </>
  );
}

export default SwitchPublic;
