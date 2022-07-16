import React, { useEffect } from "react";
import UseImportScript from "../../../hooks/UseImportScript";
import { Typography, Button, Select, Input } from "antd";
import styles from "./GroupPage.module.css";
// import app from "./app.js";
import remove from "./remove.js";
// import remove2 from "./remove2.js";

// <link rel="stylesheet" href="https://unpkg.com/mvp.css">

function GroupPage() {
  // console.log(__dirname);
  const { Title } = Typography;
  UseImportScript(
    "https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/selfie_segmentation.js"
  ); // crossorigin="anonymous"
  UseImportScript(
    "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js"
  ); // crossorigin="anonymous"
  UseImportScript("https://mrdoob.github.io/stats.js/build/stats.min.js");
  // UseImportScript("/socket.io/socket.io.js");
  UseImportScript("https://cdn.socket.io/4.5.0/socket.io.min.js");
  // UseImportScript("./app.js");
  // UseImportScript("./remove.js"); // type = "module"
  // UseImportScript("./remove2.js"); // type = "module"
  // app();
  // remove2();
  useEffect(() => {
    remove();
  }, []);

  return (
    <div>
      <Title>Noom</Title>
      <main>
        <div id="welcome">
          <form>
            <Input placeholder="room name" required type="text" />
            <Button>Enter Room</Button>
          </form>
        </div>
        <div id="call">
          <div id="control">
            <Button id="take_photo">Take Photo</Button>
            <Select id="cameras"></Select>
            <Button id="mute">Mute</Button>
            <Button id="camera">Turn Camera Off</Button>
          </div>
          <div className={styles.box}>
            <video
              className={styles.displaynone}
              id="my_face"
              autoPlay
              playsInline
              width="640"
              height="480"
            ></video>
            <canvas className={styles.displaynone} id="mygreen"></canvas>
            <div className={styles.myBox}>
              <canvas className="mirror" id="mytrans"></canvas>
            </div>
            <div className={styles.remoteBox}>
              <canvas className={styles.mirror} id="remotetrans"></canvas>
            </div>
          </div>

          <div id="streams">
            <video
              className={styles.displaynone}
              id="remote"
              autoPlay
              playsInline
              width="640"
              height="480"
            ></video>
            <canvas className={styles.displaynone} id="remotegreen"></canvas>
          </div>
          <div id="photos">
            <canvas id="photo"></canvas>
          </div>
        </div>
      </main>
    </div>
  );
}

export default GroupPage;
