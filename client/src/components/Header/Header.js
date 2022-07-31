import React from "react";
import { useNavigate } from "react-router-dom";
import { Dropdown, Button, Menu } from "antd";
import image from "../../img/appLogo.png";
import styles from "./Navbar.module.css";

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
        label: <a href="/logout">로그아웃</a>,
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
        <Button>三</Button>
      </Dropdown>
      <div className={styles.move_back} onClick={() => navigate("/main")}>
        <img src={require("../../img/backIcon.png")}></img>
      </div>
    </nav>
  );
};

export default Header;
