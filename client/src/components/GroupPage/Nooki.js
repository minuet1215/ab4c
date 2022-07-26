import * as tf from "@tensorflow/tfjs";
const bodyPix = require("@tensorflow-models/body-pix");
async function BackgroundRemoval(canvas) {
  const net = await bodyPix.load({
    architecture: "MobileNetV1",
    outputStride: 16,
    multipiler: 0.75,
    quantBytes: 2,
  });
  const segmentation = await net.segmentPerson(canvas, {
    internalResolution: "medium",
  });

  const ctx = canvas.getContext("2d");
  const { data: imgData } = ctx.getImageData(0, 0, canvas.width, canvas.height);

  const newImg = ctx.createImageData(canvas.width, canvas.height);
  const newImgData = newImg.data;

  segmentation.data.forEach((segment, i) => {
    if (segment == 1) {
      newImgData[i * 4] = imgData[i * 4];
      newImgData[i * 4 + 1] = imgData[i * 4 + 1];
      newImgData[i * 4 + 2] = imgData[i * 4 + 2];
      newImgData[i * 4 + 3] = imgData[i * 4 + 3];
    }
  });

  ctx.putImageData(newImg, 0, 0);
}

export default BackgroundRemoval;
