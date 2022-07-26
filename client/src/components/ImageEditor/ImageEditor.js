import React, { useRef } from "react";
import Header from "../Header/Header";

import ImageEditor from "@toast-ui/react-image-editor";
import Sticker from "./Sticker";

import "tui-image-editor/dist/tui-image-editor.css";
import "tui-color-picker/dist/tui-color-picker.css";
import whiteTheme from "./theme";
import "./styles.css";
import { useLocation } from "react-router-dom";

export default function Editor() {
  const editorRef = useRef();
  const location = useLocation();

  const img_path = location.state.path;
  // console.log(img_path);
  const addSticker = (path) => {
    const editorInstance = editorRef.current.getInstance();
    editorInstance.addImageObject(path);
  };

  const OnSave = () => {
    let now = new Date();
    const date_time = `${now.getFullYear()}${now.getMonth()}${now.getDate()}_${now.getHours()}${now.getMinutes()}`;
    const canvas = document.getElementsByClassName("lower-canvas")[0];
    const dataUrl = canvas.toDataURL();
    const filename = "4cut_" + date_time + ".png";
    let link = document.createElement("a");
    if (typeof link.download === "string") {
      link.href = dataUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open(dataUrl);
    }
  };

  return (
    <div className="outer_container">
      <Header subTitle="사진 꾸미기" onBackUrl="/album" />
      <ImageEditor
        ref={editorRef}
        includeUI={{
          loadImage: {
            path: img_path,
            name: "김민우와 아이들",
          },
          theme: whiteTheme,
          menu: ["text", "filter"],
          uiSize: {
            // width: "100%",
            height: "calc(100vh - 2 * 74px - 80px)",
          },
          menuBarPosition: "bottom",
        }}
        cssMaxHeight={document.documentElement.clientHeight}
        cssMaxWidth={document.documentElement.clientWidth}
        selectionStyle={{
          cornerSize: 20,
          rotatingPointOffset: 70,
        }}
        usageStatistics={false}
      />
      <div style={{ height: "80px", display: "flex" }}>
        <Sticker onStickerSelected={(path) => addSticker(path)} />
      </div>
      <div
        style={{
          height: "74px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button
          className="button btn_1 "
          style={{ width: "200px", height: "50px" }}
          onClick={OnSave}
        >
          저장
        </button>
      </div>
    </div>
  );
}
