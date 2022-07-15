import { segment } from "./modules/segment.mjs";
const videoElement = document.querySelector("video#gum_video");
const transparentCanvas = document.querySelector("canvas#transparent_canvas");
const deviceSelect = document.querySelector("select#devices");
const FRAME_RATE = 30;
let videoWidth = 640;
let videoHeight = 480;

// Safari & Firefox don't support OffscreenCanvas
const offscreenCanvas =
  typeof OffscreenCanvas === "undefined"
    ? document.createElement("canvas")
    : new OffscreenCanvas(1, 1);

async function getVideo() {
  console.log(`Getting ${videoWidth}x${videoHeight} video`);

  document.querySelectorAll("video").forEach((element) => {
    element.height = videoHeight;
    element.width = videoWidth;
  });

  //   let videoSource = videoDevices[deviceSelect.selectedIndex || 0]?.deviceId;

  let stream = await navigator.mediaDevices.getUserMedia({
    video: {
      height: { exact: videoHeight },
      width: { exact: videoWidth },
      frameRate: FRAME_RATE,
      deviceId: undefined,
    },
  });
  videoElement.srcObject = stream;
  videoElement.play();
  console.log(`Capture camera with device ${stream.getTracks()[0].label}`);
}

async function start() {
  // create a stream and send it to replace when its starts playing
  videoElement.onplaying = async () => {
    // use the offscreen canvas when the visible one is hidden for improved performance
    // offscreen으로 해야 안나옴

    let lastTime = new Date();

    async function getFrames() {
      const now = videoElement.currentTime;
      if (now > lastTime) {
        const fps = (1 / (now - lastTime)).toFixed();
        await segment(videoElement, transparentCanvas);
      }
      lastTime = now;
      requestAnimationFrame(getFrames);
    }

    await getFrames();
  };

  // Note: list of devices may change after first camera permission approval
  await getDevices();
  await getVideo();
}

let videoDevices = [];

async function getDevices() {
  let devices = await navigator.mediaDevices.enumerateDevices();
  videoDevices = devices.filter((device) => device.kind === "videoinput");
  console.log("video devices:", videoDevices);
  videoDevices.forEach((device) => {
    const option = document.createElement("option");
    option.text = device.label;
    deviceSelect.appendChild(option);
  });
}

deviceSelect.onchange = getVideo;

start().catch((err) => console.error(err));
