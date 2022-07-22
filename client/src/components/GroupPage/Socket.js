import React, { useEffect, useState, forwardRef } from "react";
import styles from "./GroupPage.module.css";
import remove from "./remove.js";
import remove2 from "./remove2.js";
import io from "socket.io-client";
const token = localStorage.getItem("token");

const VideoAREA = forwardRef((props, ref) => {
  const SOCKET_SERVER_URL = "http://localhost:5001"; // ! : local
  // const SOCKET_SERVER_URL = "http://www.4cut.shop"; // ! : dev
  const DEFAULT_BACKGROUND =
    "url(https://image.jtbcplus.kr/data/contents/jam_photo/202103/31/381e8930-6c3a-440f-928f-9bc7245323e0.jpg)";
  let isHost = token === props.roomName;
  const { localVideoRef, socketRef, pcRef, remoteVideoRef, captureAreaRef } =
    ref;
  let [leave, setLeave] = useState(true); //나가면 상대방 삭제되게 하는 State
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
          setLeave(false);
        }
      };
      socketRef.current.emit("join_room", {
        room: props.roomName,
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
      setLeave(true);
      console.log("나감");
    });
    socketRef.current.on("start", () => {
      props.setCapture(true);
    });
    socketRef.current.on("backgroundChange", (img) => {
      props.setBgImg(img);
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
  if (isHost && props.isCapture) {
    socketRef.current.emit("start", props.roomName);
  }
  if (isHost && props.bgimg) {
    socketRef.current.emit("backgroundChange", props.bgimg, props.roomName);
  }
  return (
    <>
      <div
        className={styles.box}
        ref={captureAreaRef}
        style={{
          backgroundImage: props.ImgBase64
            ? `url(${props.ImgBase64})`
            : DEFAULT_BACKGROUND,
        }}
      >
        <canvas className={styles.mirror} id="mytrans"></canvas>
        <canvas
          className={leave ? styles.displaynone : styles.mirror}
          id="remotetrans"
        ></canvas>
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
    </>
  );
});
export default VideoAREA;
