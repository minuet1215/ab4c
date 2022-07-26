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

  const img_path = location.state.path;
  console.log(img_path);
  const addSticker = (path) => {
    const editorInstance = editorRef.current.getInstance();
    editorInstance.addImageObject(path);
  };

  // const onUploadImg = (e) => {
  //   e.preventDefault();

  //   const canvas = document.getElementsByClassName("lower-canvas")[0];
  //   canvas.toBlob(
  //     function (blob) {
  //       const file = new File([blob], "4cut.png", {
  //         lastModified: new Date().getTime(),
  //         type: blob.type,
  //       });
  //       const formData = new FormData();
  //       const config = {
  //         header: { "content-type": "multipart/form-data" },
  //       };
  //       formData.append("user-file", file);
  //       axios.post("/api/images/uploads", formData, config).then((res) => {
  //         if (res.status === 200) {
  //           console.log("업로드 성공!");
  //         } else {
  //           console.log("업로드 실패...");
  //         }
  //       });
  //     },
  //     "image/jpeg",
  //     1.0
  //   );
  // };

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
    <>
      <Header />
      <Button onClick={OnSave}>저장</Button>
      <ImageEditor
        ref={editorRef}
        includeUI={{
          loadImage: {
            path: img_path,
            name: "김민우와 아이들",
          },
          theme: whiteTheme,
          menu: ["text", "filter"],
          // initMenu: "filter",
          uiSize: {
            //   width: "500px",
            height: '700px',
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
    </>
  );
}
