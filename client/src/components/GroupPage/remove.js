import { segment } from "./segment.mjs";
import { addShader } from "./wegbl-transparency.mjs";

export default function Remove() {
  const videoElement = document.querySelector("video#my_face");
  const greenScreenCanvas = document.querySelector("canvas#mygreen");
  const webglCanvas = document.querySelector("canvas#mytrans");
  // const FRAME_RATE = 30;
  // let videoWidth = 640;
  // let videoHeight = 480;
  let segmentedCanvas;

  async function start() {
    // create a stream and send it to replace when its starts playing
    videoElement.onplaying = async () => {
      // use the offscreen canvas when the visible one is hidden for improved performance
      segmentedCanvas = greenScreenCanvas;
      segmentedCanvas.height = videoElement.height;
      segmentedCanvas.width = videoElement.width;

      let lastTime = new Date();

      async function getFrames() {
        const now = videoElement.currentTime;
        if (now > lastTime) {
          await segment(videoElement, segmentedCanvas);
        }
        lastTime = now;
        requestAnimationFrame(getFrames);
      }

      await getFrames();

      addShader(greenScreenCanvas, webglCanvas);
    };

    // Note: list of devices may change after first camera permission approval
    // await getDevices();
    // await getVideo();
  }

  start().catch((err) => console.error(err));
}
