import React, { useRef, useEffect } from "react";
import TuiImageEditor from "tui-image-editor";
import whiteTheme from "./theme";

const useEditor = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const tuiEditor = new TuiImageEditor(ref.current, {
      includeUI: {
        loadImage: {
          path:
            "https://image.shutterstock.com/image-photo/bright-spring-view-cameo-island-260nw-1048185397.jpg",
          name: "SampleImage"
        },
        theme: whiteTheme, // or whiteTheme
        // initMenu: "filter",
        menuBarPosition: "bottom",
        menu: [
          "crop",
          "flip",
          "rotate",
          "draw",
          "shape",
          "icon",
          "text",
          "mask",
          "filter"
        ]
      },
      selectionStyle: {
        cornerSize: 20,
        rotatingPointOffset: 70
      }
    });

    console.log(tuiEditor);
  }, []);

  return ref;
};

export const ImageEditor = () => {
  const ref = useEditor();

  return <div ref={ref} />;
};
