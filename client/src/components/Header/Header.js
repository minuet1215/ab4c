import React from "react";
import { useNavigate } from "react-router-dom";
import { Dropdown, Button, Menu } from "antd";
// import image from "../../img/appLogo.png";
import { MenuOutlined, LeftOutlined } from "@ant-design/icons";

import styles from "./Navbar.module.css";

import Logout from "../Logout/Logout";

const menu = (
  <Menu
    items={[
      {
        key: "1",
        label: <a href="/allalbum">전체앨범</a>,
      },
      {
        key: "2",
        label: <a href="/friendlist">친구안방</a>,
      },
      {
        key: "3",
        label: <Logout />,
      },
    ]}
  />
);

const Header = ({ onBackUrl = "/main", subTitle }) => {
  const navigate = useNavigate();
  return (
    <nav className={styles.navbar}>
      <Button
        className={styles.back_btn}
        icon={<LeftOutlined />}
        onClick={() => navigate(onBackUrl)}
        style={window.location.pathname === "/main" ? { display: "none" } : {}}
      />

      <div className={styles.main_logo} onClick={() => navigate("/main")}>
        <span
          style={{
            fontSize: "32px",
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
        style={
          window.location.pathname === "/login" ||
          window.location.pathname === "/register"
            ? { display: "none" }
            : {}
        }
      >
        <Dropdown overlay={menu} placement="bottomRight">
          <Button icon={<MenuOutlined />} />
        </Dropdown>
      </div>
    </nav>
  );
};

export default Header;
