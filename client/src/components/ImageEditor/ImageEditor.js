import React, { useRef } from "react";
import Header from "../Header/Header";

import ImageEditor from "@toast-ui/react-image-editor";
import Sticker from "./Sticker";

import "tui-image-editor/dist/tui-image-editor.css";
import "tui-color-picker/dist/tui-color-picker.css";
import whiteTheme from "./theme";
import "./styles.css";
import { Button } from "antd";

export default function Editor() {
  const editorRef = useRef();

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
            path: "https://s3.us-west-2.amazonaws.com/secure.notion-static.com/d6a4d04d-1aff-418b-aea7-489ec8343543/%E1%84%83%E1%85%A1%E1%84%8B%E1%85%AE%E1%86%AB%E1%84%85%E1%85%A9%E1%84%83%E1%85%B3_%283%29.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220720%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220720T070239Z&X-Amz-Expires=86400&X-Amz-Signature=7c16221614c8b7a6662b21be6a5c876b5b7f64e23bf9519cb008a7f57fd60a97&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22%25E1%2584%2583%25E1%2585%25A1%25E1%2584%258B%25E1%2585%25AE%25E1%2586%25AB%25E1%2584%2585%25E1%2585%25A9%25E1%2584%2583%25E1%2585%25B3%2520%283%29.png%22&x-id=GetObject",
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
