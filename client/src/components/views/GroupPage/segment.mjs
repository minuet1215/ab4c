// ToDo: make this a class
let height, width;

function greenScreen(results, ctx) {
  ctx.clearRect(0, 0, width, height);

  // Draw the mask
  ctx.drawImage(results.segmentationMask, 0, 0, width, height);

  // Fill green on everything but the mask
  ctx.globalCompositeOperation = "source-out";
  ctx.fillStyle = "#00FF00";
  ctx.fillRect(0, 0, width, height);

  // Add the original video back in (in image) , but only overwrite missing pixels.
  ctx.globalCompositeOperation = "destination-atop";
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

export async function segment(videoElement, greenCanvas) {
  width = videoElement.width;
  height = videoElement.height;

  greenCanvas.height = height;
  greenCanvas.width = width;
  const greenCtx = greenCanvas.getContext("2d");

  selfieSegmentation.onResults((results) => {
    greenScreen(results, greenCtx);
  });
  await selfieSegmentation.send({ image: videoElement });
}
