import React, { useRef } from "react";
import Header from "../Header/Header";

import ImageEditor from "@toast-ui/react-image-editor";
import Sticker from "./Sticker";

import "tui-image-editor/dist/tui-image-editor.css";
import "tui-color-picker/dist/tui-color-picker.css";
import whiteTheme from "./theme";
import "./styles.css";

import { Button } from "antd";
import { useLocation } from "react-router-dom";

export default function Editor() {
  const editorRef = useRef();
  const location = useLocation();

  // TODO : 넘겨받은 img 주소를 아래 path에 넣어주기
  const img_path = location.state.path;
  console.log(img_path);

  const addSticker = (path) => {
    const editorInstance = editorRef.current.getInstance();
    editorInstance.addImageObject(path);
  };

  const savePhoto = () => {
    let dataURL = editorRef.current.getInstance().toDataURL("jpeg", "0.75");
    console.log(dataURL);
  };

  return (
    <>
      <Header />
      <ImageEditor
        ref={editorRef}
        includeUI={{
          loadImage: {
            path: img_path,
            name: "김민우와 아이들",
          },
          theme: whiteTheme,
          menu: ["text", "filter"],
          initMenu: "filter",
          uiSize: {
            //   width: "500px",
            height: "900px",
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
      <Sticker onStickerSelected={(path) => addSticker(path)} />
      <Button onClick={savePhoto}>저장</Button>
    </>
  );
}
