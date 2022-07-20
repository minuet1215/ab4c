import React from "react";
import Header from "../Header/Header";

import TuiImageEditor from "tui-image-editor";
import "tui-image-editor/dist/tui-image-editor.css";
import "tui-color-picker/dist/tui-color-picker.css";
import whiteTheme from "../TEST/theme";
import "../TEST/styles.css";
class ImageEditor extends React.Component {
  rootEl = React.createRef();
  imageEditorInst = null;

  componentDidMount() {
    this.imageEditorInst = new TuiImageEditor(this.rootEl.current, {
      ...this.props,
    });
  }

  componentWillUnmount() {
    // this.unbindEventHandlers();
    this.imageEditorInst.destroy();
    this.imageEditorInst = null;
  }

  render() {
    return <div ref={this.rootEl} />;
  }
}

const myTheme = {
  "header.display": "none",
};

export default function Editor() {
  const props = {
    includeUI: {
      loadImage: {
        path: "https://s3.us-west-2.amazonaws.com/secure.notion-static.com/5b4c3215-9f8d-4934-9475-fc20c8f0a230/tmpImage2.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220719%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220719T110256Z&X-Amz-Expires=86400&X-Amz-Signature=ca9a3d78832fcc7cc4da6bb2704cd04f7938042a6914b29a3a3a904b7c84c4d7&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22tmpImage2.jpeg%22&x-id=GetObject",
        name: "My sample Image",
      },
      theme: whiteTheme,
      menu: ["filter", "text", "icon"],
      initMenu: "filter",
      uiSize: {
        width: document.documentElement.clientWidth,
        height: "780px",
      },
      menuBarPosition: "bottom",
    },
    cssMaxWidth: document.documentElement.clientWidth,
    cssMaxHeight: document.documentElement.clientHeight,
    selectionStyle: {
      cornerSize: 20,
      cornerColor: "pink",
      rotatingPointOffset: 80,
    },
  };

  return (
    <div className="Editor">
      <Header />
      <ImageEditor {...props} />
    </div>
  );
}
