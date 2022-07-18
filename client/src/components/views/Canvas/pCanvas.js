import React, { useEffect, useState } from "react";
import {fabric} from "fabric";

function Draw() {
    const [canvas, setCanvas] = useState("");

    const initCanvas = () =>
    new fabric.Canvas("canvas", {
        height : 800,
        width : 800,
        backgroundColor : "gray"
    });

    useEffect(() => {
        setCanvas(initCanvas());
    }, []);

    return <canvas id="canvas" />;
}

export default Draw;