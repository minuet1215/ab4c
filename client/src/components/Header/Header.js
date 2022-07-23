import React from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "antd";

function Header({ subTitle, onBackUrl = "/", onClick = undefined }) {
  const navigate = useNavigate();
  return (
    <PageHeader
      style={{ border: "1px solid rgb(235, 237, 240)" }}
      onBack={() => {
        if (onClick != undefined) onClick();
        navigate(onBackUrl);
      }}
      title="안방 네컷"
      subTitle={subTitle}
    />
  );
}

export default Header;
