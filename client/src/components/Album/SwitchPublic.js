import React, { useState } from "react";
import { Switch } from "antd";
import axios from "axios";
import { toast } from "react-toastify";

function SwitchPublic(modalContent) {
  const [isPublic, setIsPublic] = useState(modalContent.img.isPublic); // true가 공개라면
  console.log("isPublic :", modalContent);

  const publicHandler = () => {
    axios
      .patch("/api/images/album/public/", modalContent)
      .then((res) => {
        setIsPublic(!isPublic);
      })
      .catch((err) => toast.error(err.message));
  };
  return (
    <>
      <Switch
        className="PublicBtn"
        checkedChildren="공개"
        unCheckedChildren="비공개"
        defaultChecked={isPublic}
        onChange={publicHandler}
      />
    </>
  );
}

export default SwitchPublic;
