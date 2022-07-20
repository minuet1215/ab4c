import GIF from "gif.js.optimized";
import workerStr from "./gifWorker";

export default function makeGif(imgArray) {
  const workerBlob = new Blob([workerStr], {
    type: "application/javascript",
  });
  console.log(workerBlob);
  const gif = new GIF({
    workers: 2,
    workerScript: URL.createObjectURL(workerBlob),
    quality: 5,
  });
  function waitForImagesLoaded(imageURLs, callback) {
    var imageElements = [];
    var remaining = imageURLs.length;
    var onEachImageLoad = function () {
      if (--remaining === 0 && callback) {
        callback(imageElements);
      }
    };

    for (var i = 0, len = imageURLs.length; i < len; i++) {
      var img = new Image();
      img.onload = onEachImageLoad;
      img.src = imageURLs[i];
      imageElements.push(img);
    }
  }
  waitForImagesLoaded(imgArray, function (images) {
    for (var i = 0; i < images.length; i++) {
      gif.addFrame(images[i], { delay: 100 });
    }
    gif.render();
  });
  console.log(gif);
  gif.on("finished", (blob) => {
    const url = URL.createObjectURL(blob);
    document.getElementById("result-image").src = url;
  });
}
