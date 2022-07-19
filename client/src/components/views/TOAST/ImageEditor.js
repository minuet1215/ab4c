import React, { useState, useEffect, useRef } from "react";
import Header from "../Header/Header";

import TuiImageEditor from "tui-image-editor";
import "tui-image-editor/dist/tui-image-editor.css";
import "tui-color-picker/dist/tui-color-picker.css";

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
        path: "https://s3.us-west-2.amazonaws.com/secure.notion-static.com/5b4c3215-9f8d-4934-9475-fc20c8f0a230/tmpImage2.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220718%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220718T103603Z&X-Amz-Expires=86400&X-Amz-Signature=e7e6c9600c1d6080ab1e09a0da92bfcbf192c39d93432dc54e2785f592f64931&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22tmpImage2.jpeg%22&x-id=GetObject",
        name: "My sample Image",
      },
      theme: myTheme,
      menu: ["filter", "text", "icon"],
      initMenu: "filter",
      uiSize: {
        height: "780px",
      },
      menuBarPosition: "bottom",
    },
    cssMaxWidth: document.documentElement.clientWidth,
    cssMaxHeight:  document.documentElement.clientHeight,
    selectionStyle: {
      cornerSize: 20,
      cornerColor : 'pink',
      rotatingPointOffset: 100,
      
    },
  };

  return (
    <div>
      <Header/>
      <ImageEditor {...props} />
    </div>
  );
}
