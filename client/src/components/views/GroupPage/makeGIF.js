import GIF from "gif.js.optimized";
import workerStr from "./gifWorker";

export default function makeGif(imgArray) {
  console.log(imgArray);
  const workerBlob = new Blob([workerStr], {
    type: "application/javascript",
  });
  console.log(workerBlob);
  const gif = new GIF({
    workers: 2,
    workerScript: URL.createObjectURL(workerBlob),
    quality: 10,
  });
  imgArray.forEach((imgUrl) => {
    const img = new Image();
    img.src = imgUrl;
    img.width = 640;
    img.height = 480;
    gif.addFrame(img, { delay: 300 });
  });
  gif.on("finished", (blob) => {
    const url = URL.createObjectURL(blob);
    document.getElementById("result-image").src = url;
  });
  gif.render();
}
