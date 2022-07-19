import React, { useEffect, useState, useRef } from "react";
import { Typography, Button, Select, Input } from "antd";
import styles from "./GroupPage.module.css";
import remove from "./remove.js";
import remove2 from "./remove2.js";
import io from "socket.io-client";
import html2canvas from "html2canvas";
import url from "socket.io-client/lib/url";
import makeGif from "./makeGIF.js";
function GroupPage() {
  let IMGS = new Array();
  const { Title } = Typography;
  let roomName = "1234";
  let [leave, setLeave] = useState(true);
  const [ImgBase64, setImgBase64] = useState(""); // 업로드 될 이미지
  const [imgFile, setImgFile] = useState(null); // 파일 전송을 위한 state
  let isMute = false;
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
          setLeave(false);
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
      setLeave(true);
      console.log("나감");
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
  function onCapture() {
    html2canvas(document.querySelector("#capture"), {
      allowTaint: false,
      useCORS: true,
      scale: 1,
    }).then((canvas) => {
      let DATA_URL = canvas.toDataURL();
      // OnSaveAs(DATA_URL, "image.png");
      document.getElementById("result-image").src = DATA_URL;
      IMGS.push(DATA_URL);
    });
  }
  //로컬 저장하는 함수, 안씀
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
  function changeMuteButton() {
    isMute = !isMute;
    localVideoRef.current.muted = isMute;
    document.getElementById("muteButton").innerText = isMute
      ? "unMute"
      : "Mute";
  }
  // 뒷배경 바꾸기
  const handleChangeFile = (event) => {
    let reader = new FileReader();

    reader.onloadend = (e) => {
      // 2. 읽기가 완료되면 아래 코드 실행
      const base64 = reader.result;
      if (base64) {
        // 파일 base64 상태 업데이트
        setImgBase64(base64.toString());
      }
    };
    if (event.target.files[0]) {
      // 1. 파일을 읽어 버퍼에 저장
      reader.readAsDataURL(event.target.files[0]);
      // 파일 상태 업데이트
      setImgFile(event.target.files[0]);
      console.log(imgFile);
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
          <button
            id="muteButton"
            onClick={() => {
              changeMuteButton();
            }}
          >
            Mute
          </button>
          <button
            onClick={() => {
              makeGif(IMGS);
            }}
          >
            Make a Gif
          </button>
          <input type="file" id="imgFile" onChange={handleChangeFile} />
          <div
            className={styles.box}
            id="capture"
            style={{
              backgroundImage: ImgBase64
                ? `url(${ImgBase64})`
                : "url(https://image.jtbcplus.kr/data/contents/jam_photo/202103/31/381e8930-6c3a-440f-928f-9bc7245323e0.jpg)",
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          >
            <canvas className={styles.mirror} id="mytrans"></canvas>
            <canvas
              className={leave ? styles.displaynone : styles.mirror}
              id="remotetrans"
            ></canvas>
          </div>
          <img id="result-image" />
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
