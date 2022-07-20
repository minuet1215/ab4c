import React from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "antd";

function Header({ subTitle, onBackUrl = "/" }) {
  const navigate = useNavigate();
  return (
    <PageHeader
      style={{ border: "1px solid rgb(235, 237, 240)" }}
      onBack={() => navigate(onBackUrl)}
      title="안방 네컷"
      subTitle={subTitle}
    />
  );
}

export default Header;
