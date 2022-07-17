import React, { Component } from "react";
import { fabric } from "fabric";

import bg from "../../../img/myPhoto1.jpeg";


class Canvas2 extends Component {
  componentDidMount() {
    const canvas2 = new fabric.Canvas("canvas2");
    canvas2.setDimensions({ width: 800, height: 600 });

    fabric.Image.fromURL(bg, function (myImg) {
      const bg = myImg.set({
        left: 0,
        top: 0,
        width: 800,
        angle: 0,
        height: 600,
        layer: 0
      });
      canvas2.add(bg);
      canvas2.sendBackwards(bg);
    });

    fabric.Image.fromURL(troll, function (myImg) {
      const img1 = myImg.set({
        left: 150,
        top: 50,
        width: 300,
        angle: 30,
        height: 400,
        layer: 1
      });
      canvas2.add(img1);
      canvas2.bringToFront(img1);
    });

    fabric.Image.fromURL(wizard, function (myImg) {
      const img2 = myImg.set({
        left: 450,
        top: 50,
        width: 300,
        angle: 0,
        height: 400
      });
      canvas2.add(img2);
      canvas2.bringToFront(img2);
    });
  }

  render() {
    const canvas_style = {
      border: "2px solid red"
    };

    return (
      <div>
        <h4>canvas2 DEMO adding image to canvas</h4>
        <canvas id="canvas2" style={canvas_style} width="600" height="400" />
      </div>
    );
  }
}

export default Canvas2;
