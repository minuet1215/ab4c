import React, { useEffect, useState, useRef } from "react";
import { Typography, Button, Select, Input } from "antd";
import styles from "./GroupPage.module.css";
import remove from "./remove.js";
import remove2 from "./remove2.js";
import io from "socket.io-client";
import html2canvas from "html2canvas";
function GroupPage() {
  const { Title } = Typography;
  let roomName = "1234";
  let [leave, setLeave] = useState({ display: "none" }); //상대방 나갔는지 체크
  const pc_config = {
    iceServers: [
      {
        urls: [
          "stun:stun.l.google.com:19302",
          "stun:stun1.l.google.com:19302",
          "stun:stun2.l.google.com:19302",
          "stun:stun3.l.google.com:19302",
          "stun:stun4.l.google.com:19302",
        ],
      },
    ],
  };
  const SOCKET_SERVER_URL = "http://localhost:5001"; // ! : local
  // const SOCKET_SERVER_URL = "http://www.4cut.shop"; // ! : dev
  const socketRef = useRef();
  const pcRef = useRef();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const setVideoTracks = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      if (!(pcRef.current && socketRef.current)) return;
      stream.getTracks().forEach((track) => {
        if (!pcRef.current) return;
        pcRef.current.addTrack(track, stream);
      });
      pcRef.current.onicecandidate = (e) => {
        if (e.candidate) {
          if (!socketRef.current) return;
          console.log("onicecandidate");
          socketRef.current.emit("candidate", e.candidate);
        }
      };
      pcRef.current.oniceconnectionstatechange = (e) => {
        console.log(e);
      };
      pcRef.current.ontrack = (ev) => {
        console.log("add remotetrack success");
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = ev.streams[0];
          setLeave({});
        }
      };
      socketRef.current.emit("join_room", {
        room: roomName,
      });
    } catch (e) {
      console.error(e);
    }
  };
  const createOffer = async () => {
    console.log("create offer");
    if (!(pcRef.current && socketRef.current)) return;
    try {
      const sdp = await pcRef.current.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });
      await pcRef.current.setLocalDescription(new RTCSessionDescription(sdp));
      socketRef.current.emit("offer", sdp);
    } catch (e) {
      console.error(e);
    }
  };
  const createAnswer = async (sdp) => {
    if (!(pcRef.current && socketRef.current)) return;
    try {
      await pcRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
      console.log("answer set remote description success");
      const mySdp = await pcRef.current.createAnswer({
        offerToReceiveVideo: true,
        offerToReceiveAudio: true,
      });
      console.log("create answer");
      await pcRef.current.setLocalDescription(new RTCSessionDescription(mySdp));
      socketRef.current.emit("answer", mySdp);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    socketRef.current = io.connect(SOCKET_SERVER_URL);
    pcRef.current = new RTCPeerConnection(pc_config);
    socketRef.current.on("all_users", (allUsers) => {
      if (allUsers.length > 0) {
        createOffer();
      }
    });
    socketRef.current.on("getOffer", (sdp) => {
      //console.log(sdp);
      console.log("get offer");
      createAnswer(sdp);
    });
    socketRef.current.on("getAnswer", (sdp) => {
      console.log("get answer");
      if (!pcRef.current) return;
      pcRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
    });
    socketRef.current.on("getCandidate", async (candidate) => {
      if (!pcRef.current) return;
      await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      console.log("candidate add success");
    });
    socketRef.current.on("user_exit", (e) => {
      setLeave({ display: "none" });
    });
    setVideoTracks();
    remove();
    remove2();
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (pcRef.current) {
        pcRef.current.close();
      }
    };
  }, []);
  const onCapture = () => {
    html2canvas(document.querySelector("#capture"), {}).then((canvas) => {
      OnSaveAs(canvas.toDataURL(), "image.png");
    });
  };
  const OnSaveAs = (uri, filename) => {
    let link = document.createElement("a");
    if (typeof link.download === "string") {
      link.href = uri;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open(uri);
    }
  };
  return (
    <div>
      <Title>Group</Title>
      <main>
        <div id="call">
          <button
            onClick={() => {
              onCapture();
            }}
          >
            캡쳐
          </button>
          <div className={styles.box} id="capture">
            <canvas className={styles.mirror} id="mytrans"></canvas>
            <canvas
              className={styles.mirror}
              style={leave}
              id="remotetrans"
            ></canvas>
          </div>
          <video
            className={styles.displaynone}
            id="my_face"
            autoPlay
            playsInline
            width="640"
            height="480"
            ref={localVideoRef}
          ></video>
          <video
            className={styles.displaynone}
            id="remote"
            autoPlay
            playsInline
            width="640"
            height="480"
            ref={remoteVideoRef}
          ></video>
          <canvas className={styles.displaynone} id="remotegreen"></canvas>
          <canvas className={styles.displaynone} id="mygreen"></canvas>
        </div>
      </main>
    </div>
  );
}

export default GroupPage;
