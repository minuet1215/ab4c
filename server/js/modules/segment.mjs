// ToDo: make this a class
let height, width;

function transparent(results, ctx) {
  ctx.clearRect(0, 0, width, height);

  // Draw the mask
  ctx.drawImage(results.segmentationMask, 0, 0, width, height);

  // Add the original video back in only overwriting the masked pixels
  ctx.globalCompositeOperation = "source-in";
  ctx.drawImage(results.image, 0, 0, width, height);
}

const selfieSegmentation = new SelfieSegmentation({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`;
  },
});
selfieSegmentation.setOptions({
  modelSelection: 1,
});

export async function segment(videoElement, transparentCanvas) {
  width = videoElement.width;
  height = videoElement.height;

  transparentCanvas.height = height;
  transparentCanvas.width = width;
  const transparentCtx = transparentCanvas.getContext("2d");

  selfieSegmentation.onResults((results) => {
    transparent(results, transparentCtx);
  });
  await selfieSegmentation.send({ image: videoElement });
}
