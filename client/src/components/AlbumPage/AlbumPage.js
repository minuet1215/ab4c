import React, { useState } from "react";
import Album from "../Album/Album";
import AllAlbum from "../AllAlbum/AllAlbum";
import styles from "./AlbumPage.module.css";
import MyHeader from "../Header/Header";

function AlbumPage() {
  const [tab, setTab] = useState("0");
  const tabStyle = {
    color: "black",
    fontWeight: "600",
    backgroundColor: "rgba(242, 212, 212, 1)",
    transform: "scale(1.05)",
    border: "none",
  };

  const HandleOnChange = (e) => {
    setTab(e.target.value);
  };

  return (
    <div className="outer_container">
      <MyHeader subTitle="앨범" onBackUrl="/main" />
      <div className={styles.tabs}>
        <input
          type="radio"
          name="menu"
          id="radio_0"
          value={0}
          className={styles.tab_input}
          onClick={HandleOnChange}
        />
        <label
          htmlFor="radio_0"
          className={styles.tab}
          style={tab === "0" ? tabStyle : {}}
        >
          <span>내 앨범</span>
        </label>

        <input
          type="radio"
          name="menu"
          id="radio_1"
          value={1}
          className={styles.tab_input}
          onClick={HandleOnChange}
        />
        <label
          htmlFor="radio_1"
          className={styles.tab}
          style={tab === "1" ? tabStyle : {}}
        >
          <span>전체 앨범</span>
        </label>
      </div>
      <div className={styles.contents_container}>
        <Contents tab={tab} />
      </div>
    </div>
  );
}

const Contents = ({ tab }) => {
  return [<Album />, <AllAlbum />][tab];
};
export default AlbumPage;
