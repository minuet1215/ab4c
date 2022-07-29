import GIF from "gif.js.optimized";
import workerStr from "./gifWorker";

export default async function makeGif(imgArray) {
  const workerBlob = new Blob([workerStr], {
    type: "application/javascript",
  });
  const gif = new GIF({
    workers: 2,
    workerScript: URL.createObjectURL(workerBlob),
    quality: 10,
  });
  async function waitForImagesLoaded(imageURLs, callback) {
    var imageElements = [];
    var remaining = imageURLs.length;
    var onEachImageLoad = function () {
      if (--remaining === 0 && callback) {
        callback(imageElements);
      }
    };
    for await (const elem of imageURLs) {
      var img = new Image();
      img.onload = onEachImageLoad;
      img.src = elem;
      imageElements.push(img);
    }
  }
  waitForImagesLoaded(imgArray, async function (images) {
    for await (const i of images) {
      gif.addFrame(i, { delay: 200 });
    }
    gif.render();
  });
  await gif.on("finished", (blob) => {
    const url = URL.createObjectURL(blob);
    document.getElementById("result-image").src = url;
  });
  return true;
}
