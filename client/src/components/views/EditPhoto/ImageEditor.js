import React, { useRef } from "react";
import Header from "../Header/Header";

import ImageEditor from "@toast-ui/react-image-editor";
import StickerRow from "./StickerRow";

import "tui-image-editor/dist/tui-image-editor.css";
import "tui-color-picker/dist/tui-color-picker.css";
import whiteTheme from "./theme";
import "./styles.css";

export default function App() {
  const editorRef = useRef();

  const addSticker = (path) => {
    const editorInstance = editorRef.current.getInstance();
    editorInstance.addImageObject(path);
  };

  return (
    <>
      <Header />
      <ImageEditor
        ref={editorRef}
        includeUI={{
          loadImage: {
            path: "https://s3.us-west-2.amazonaws.com/secure.notion-static.com/5b4c3215-9f8d-4934-9475-fc20c8f0a230/tmpImage2.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220719%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220719T135443Z&X-Amz-Expires=86400&X-Amz-Signature=411aa44dbd2d60ca980ac9c0f4d3175bfaa064c9c2d71f632ea2c1a4c6e3e4ec&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22tmpImage2.jpeg%22&x-id=GetObject",
            name: "SampleImage",
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
      <StickerRow onStickerSelected={(path) => addSticker(path)} />
    </>
  );
}
