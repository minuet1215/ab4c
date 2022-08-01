import React, { useEffect, useState, forwardRef } from "react";
import styles from "./GroupPage.module.css";
import remove from "./remove.js";
import remove2 from "./remove2.js";
import io from "socket.io-client";
import Loading from "../Loading/Loading";
import { Rnd } from "react-rnd";

const VideoAREA = forwardRef((props, ref) => {
  const isSingle = props.isSingle;
  const [loading, setLoading] = useState(true);
  const SOCKET_SERVER_URL = "http://localhost:5001"; // ! : local
  // const SOCKET_SERVER_URL = "http://www.4cut.shop"; // ! : dev
  const DEFAULT_BACKGROUND =
    "url(https://image.jtbcplus.kr/data/contents/jam_photo/202103/31/381e8930-6c3a-440f-928f-9bc7245323e0.jpg)";
  const isHost = props.token === props.roomName;
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
      if (!isSingle) {
        if (!(pcRef.current && socketRef.current)) return;
        stream.getTracks().forEach((track) => {
          if (!pcRef.current) return;
          pcRef.current.addTrack(track, stream);
        });
        pcRef.current.onicecandidate = (e) => {
          if (e.candidate) {
            if (!socketRef.current) return;
            socketRef.current.emit("candidate", e.candidate);
          }
        };
        pcRef.current.oniceconnectionstatechange = (e) => {
          //
        };
        pcRef.current.ontrack = (ev) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = ev.streams[0];
            setLeave(false);
          }
        };
        socketRef.current.emit("join_room", {
          room: props.roomName,
        });
      }
    } catch (e) {
      //
    }
    remove(setLoading);
  };
  const createOffer = async () => {
    if (!(pcRef.current && socketRef.current)) return;
    try {
      const sdp = await pcRef.current.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });
      remove2();
      await pcRef.current.setLocalDescription(new RTCSessionDescription(sdp));
      socketRef.current.emit("offer", sdp);
    } catch (e) {
      //
    }
  };
  const createAnswer = async (sdp) => {
    if (!(pcRef.current && socketRef.current)) return;
    try {
      await pcRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
      const mySdp = await pcRef.current.createAnswer({
        offerToReceiveVideo: true,
        offerToReceiveAudio: true,
      });
      remove2();
      await pcRef.current.setLocalDescription(new RTCSessionDescription(mySdp));
      socketRef.current.emit("answer", mySdp);
    } catch (e) {
      //
    }
  };

  useEffect(() => {
    setLoading(true);
    if (!isSingle) {
      socketRef.current = io.connect(SOCKET_SERVER_URL);
      pcRef.current = new RTCPeerConnection(pc_config);
      socketRef.current.on("all_users", (allUsers) => {
        if (allUsers.length > 0) {
          createOffer();
        }
      });
      socketRef.current.on("getOffer", (sdp) => {
        createAnswer(sdp);
      });
      socketRef.current.on("getAnswer", (sdp) => {
        if (!pcRef.current) return;
        pcRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
      });
      socketRef.current.on("getCandidate", async (candidate) => {
        if (!pcRef.current) return;
        await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      });
      socketRef.current.on("user_exit", (e) => {
        setLeave(true);
      });

      socketRef.current.on("start", () => {
        if (!isHost) {
          props.setCapture(true);
        }
      });

      socketRef.current.on("backgroundChange", (img) => {
        if (!isHost) {
          props.setImgBase64(img);
        }
      });
    }

    setVideoTracks();

    return () => {
      if (!isSingle) {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
        if (pcRef.current) {
          pcRef.current.close();
        }
      }
    };
  }, []);
  if (!isSingle && isHost && props.isCapture) {
    socketRef.current.emit("start", props.roomName);
  }
  if (!isSingle && isHost && props.ImgBase64) {
    socketRef.current.emit("backgroundChange", props.ImgBase64, props.roomName);
  }
  return (
    <>
      <div>{loading ? <Loading /> : null}</div>
      <div
        className={styles.box}
        ref={captureAreaRef}
        style={{
          backgroundImage: props.ImgBase64
            ? `url(${props.ImgBase64})`
            : DEFAULT_BACKGROUND,
        }}
      >
        <Rnd
          style={{ zIndex: "999", background: "aqua" }}
          default={{
            x: 50,
            y: 50,
            width: "100%",
            height: "100%",
          }}
          // bounds="parent" // 부모컴포넌트 내에서만 이동가능(parent or window)
        >
          <canvas id="myStar"></canvas>
        </Rnd>
        <canvas
          className={isHost ? styles.host : styles.guest}
          id="mytrans"
        ></canvas>
        {!isSingle ? (
          <canvas
            className={
              leave ? styles.displaynone : isHost ? styles.guest : styles.host
            }
            id="remotetrans"
          ></canvas>
        ) : undefined}
        <video
          className={styles.displaynone}
          id="my_face"
          autoPlay
          playsInline
          width="640"
          height="480"
          ref={localVideoRef}
        ></video>
        {!isSingle ? (
          <>
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
          </>
        ) : undefined}

        <canvas className={styles.displaynone} id="mygreen"></canvas>
      </div>
    </>
  );
});
export default VideoAREA;
