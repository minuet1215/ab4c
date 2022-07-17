import React, { Component } from "react";
import { fabric } from "fabric";

import bg from "../../../img/frame.jpeg";
import troll from "../../../img/angryTroll.png";
import Header from "../Header/Header";

class Canvas extends Component {
  componentDidMount() {
    const canvas = new fabric.Canvas("canvas");
    canvas.setDimensions({ width: 380, height: 600 });

    fabric.Image.fromURL(bg, function (myImg) {
      const bg = myImg.set({
        left: 0,
        top: 0,
        width: 354,
        angle: 0,
        height: 900,
        layer: 0,
      });
      canvas.add(bg);
      canvas.sendBackwards(bg);
    });

    fabric.Image.fromURL(troll, function (myImg) {
      const img1 = myImg.set({
        left: 150,
        top: 50,
        width: 500,
        angle: 30,
        height: 500,
        layer: 1,
      });
      canvas.add(img1);
      canvas.bringToFront(img1);
    });
  }

  render() {
    const canvas_style = {
      border: "2px solid black",
      padding: "2px",
    };

    return (
      <>
        <div>
          <Header />
          <h4>나의 사진 수정하기</h4>
          <canvas id="canvas" style={canvas_style} width="354" height="600" />
        </div>
      </>
    );
  }
}

export default Canvas;
