import React from "react";
import { useNavigate } from "react-router-dom";
import { Dropdown, Button, Menu } from "antd";
import image from "../../img/appLogo.png";
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

const Header = () => {
  const navigate = useNavigate();
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbar_logo} onClick={() => navigate("/main")}>
        <img src={image}></img>
      </div>
      <Dropdown
        className={styles.dropdown_box}
        overlay={menu}
        placement="bottomRight"
      >
        <Button icon={<MenuOutlined />} />
      </Dropdown>
      <Button
        className={styles.ant_btn}
        icon={<LeftOutlined />}
        onClick={() => navigate("/main")}
      />
    </nav>
  );
};

export default Header;
