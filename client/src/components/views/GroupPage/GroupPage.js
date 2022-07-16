import React, { useEffect } from "react";

import { Typography, Button, Select, Input } from "antd";
import styles from "./GroupPage.module.css";
import app from "./app.js";
import remove from "./remove.js";
import remove2 from "./remove2.js";

function GroupPage() {
  const { Title } = Typography;

  useEffect(() => {
    app();
    remove();
    remove2();
  });

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
