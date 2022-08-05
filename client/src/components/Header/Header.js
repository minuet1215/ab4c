import React from "react";
import { useNavigate } from "react-router-dom";
import { Dropdown, Button, Menu } from "antd";
import { MenuOutlined, LeftOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

import styles from "./Navbar.module.css";

import Logout from "../Logout/Logout";

const menu = (
  <Menu
    items={[
      {
        key: "1",
        label: <Link to="/allalbum">전체앨범</Link>,
      },
      {
        key: "2",
        label: <Link to="/friendlist">친구안방</Link>,
      },
      {
        key: "3",
        label: <Logout />,
      },
    ]}
  />
);

const Header = ({ onBackUrl = "/main", subTitle, click = undefined }) => {
  const navigate = useNavigate();
  const hiddenList = ["login", "register", "group"]; // 드롭다운 표시하지 않는 화면 리스트
  let currentPageName = window.location.pathname.split("/")[1]; // 현재 화면 이름
  return (
    <nav className={styles.navbar}>
      <Button
        className={styles.back_btn}
        icon={<LeftOutlined />}
        onClick={() => {
          navigate(onBackUrl);
          if (click !== undefined) click();
        }}
        style={window.location.pathname === "/main" ? { display: "none" } : {}}
      />

      <div className={styles.main_logo} onClick={() => navigate("/main")}>
        <span
          style={{
            fontSize: "3vh",
            fontWeight: "600",
          }}
        >
          안방 네컷
        </span>
        <span
          style={{
            fontSize: "16px",
            fontWeight: "500",
          }}
        >
          {subTitle ? " : " + subTitle : ""}
        </span>
      </div>
      <div
        className={styles.dropdown_box}
        style={hiddenList.includes(currentPageName) ? { display: "none" } : {}}
      >
        <Dropdown overlay={menu} placement="bottomRight">
          <Button icon={<MenuOutlined />} />
        </Dropdown>
      </div>
    </nav>
  );
};

export default Header;
