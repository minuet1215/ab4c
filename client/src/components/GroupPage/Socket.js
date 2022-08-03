import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import styles from "./GroupPage.module.css";
/* 내 화면을 누끼 따주는 파일*/
import remove from "./remove.js";
/* 상대방 화면을 누끼 따주는 파일*/
import remove2 from "./remove2.js";
/* socket.io */
import io from "socket.io-client";
import Loading from "../Loading/Loading";
/* 아이템 */
import { Rnd } from "react-rnd";
/* 모바일 감지 */
import { isMobile } from "react-device-detect";

/* VideoArea Component */
const VideoAREA = forwardRef((props, ref) => {
  const isSingle = props.isSingle; //싱글 모드 감지
  /* 다른 파일에서 소켓 메시지 날리고싶을때를 대비해서 만든 함수 정의*/
  useImperativeHandle(ref.SocketMessageRef, () => ({
    emitStart() {
      if (!isSingle) {
        console.log("Emit start");
        /* 캡쳐 버튼을 누르면 해당 room에 시작했다는 메시지를 보낸다.*/
        socketRef.current.emit("start", props.roomName);
      }
    },
    emitStar: (image) => {
      if (!isSingle) {
        /* 아이템을 클릭하면 해당 room에 메시지를 보냄*/
        socketRef.current.emit("starChange", image, props.roomName);
      }
    },
  }));
  const [loading, setLoading] = useState(true);
  const [isDesktopRatio, setDesktopRatio] = useState(true); // 데스크탑 비율인지, 모바일비율인지 감지
  const SOCKET_SERVER_URL = "http://localhost:5001"; // ! : local
  // const SOCKET_SERVER_URL = "http://www.4cut.shop"; // ! : dev
  const DEFAULT_BACKGROUND =
    "url(https://image.jtbcplus.kr/data/contents/jam_photo/202103/31/381e8930-6c3a-440f-928f-9bc7245323e0.jpg)";
  const isHost = props.token === props.roomName; //token과 room이 같으면 방장입니다.
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

  /* 내 카메라와 socket 연결 켜는 함수, 퍼온거라 자세히는 모름. */
  const setVideoTracks = async () => {
    try {
      /* getUserMedia를 이용하면 카메라를 켤수 있음.*/
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: isSingle ? false : true, // 싱글모드일 경우 audio off.
      });
      /* getUserMedia를 통해 가져온 Stream을 loacalVideo 속성에 넣어줌 */
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      /* 소켓 연결은 싱글모드가 아닐때만 함*/
      if (!isSingle) {
        if (!(pcRef.current && socketRef.current)) return;
        /* 자신의 video, audio track을 RTCPeerConnection에 등록*/
        stream.getTracks().forEach((track) => {
          if (!pcRef.current) return;
          pcRef.current.addTrack(track, stream);
        });
        /* candidate */
        pcRef.current.onicecandidate = (e) => {
          if (e.candidate) {
            if (!socketRef.current) return;
            socketRef.current.emit("candidate", e.candidate, props.roomName);
          }
        };
        pcRef.current.oniceconnectionstatechange = (e) => {
          //
        };
        /* */
        pcRef.current.ontrack = (ev) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = ev.streams[0];
            setLeave(false);
          }
        };
        /* 자신의 video, audio track을 모두 자신의 RTCPeerConnection에 등록한 후에 room에 접속했다고 Signaling Server에 알린다.
        // 왜냐하면 offer or answer을 주고받을 때의 RTCSessionDescription에 해당 video, audio track에 대한 정보가 담겨 있기 때문에
        // 순서를 어기면 상대방의 MediaStream을 받을 수 없음*/
        socketRef.current.emit("join_room", {
          room: props.roomName,
        });
      }
    } catch (e) {
      console.log(`getUserMedia error: ${e}`);
    }
    /* 내 비디오 연결과 소켓 연결이 끝났으면 누끼를 따버림
        모바일인경우, 누끼 처리 모델이 달라지므로 인자값을 넣어줬음*/
    remove(setLoading, isMobile);
  };

  /* 상대방에게 offer signal 전달 */
  const createOffer = async () => {
    if (!(pcRef.current && socketRef.current)) return;
    try {
      const sdp = await pcRef.current.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });
      remove2(isMobile);
      await pcRef.current.setLocalDescription(new RTCSessionDescription(sdp));
      socketRef.current.emit("offer", sdp, props.roomName);
    } catch (e) {
      console.log(e);
    }
  };
  /* 상대방에게 answer Signal 전달 */
  const createAnswer = async (sdp) => {
    if (!(pcRef.current && socketRef.current)) return;
    try {
      await pcRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
      const mySdp = await pcRef.current.createAnswer({
        offerToReceiveVideo: true,
        offerToReceiveAudio: true,
      });
      await pcRef.current.setLocalDescription(new RTCSessionDescription(mySdp));
      socketRef.current.emit("answer", mySdp, props.roomName);
      /* 상대방 누끼 땀*/
      remove2(isMobile);
    } catch (e) {
      console.log(e);
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
      /* 상대방이 나가면 setLeave true로.
        setLeave 정보값을 이용해 밑에서 canvas css정보를 조작함 */
      socketRef.current.on("user_exit", (e) => {
        setLeave(true);
      });
      /* 시작했다고 메시지 받으면 setCapture 함수를 이용해 자신도 시작함*/
      socketRef.current.on("start", () => {
        props.setCapture(true);
      });
      /* 배경이 바뀌었다고 메시지 받으면 SET */
      socketRef.current.on("backgroundChange", (img) => {
        props.setImgBase64(img);
      });
      /* 상대방의 비율정보를 받음 */
      socketRef.current.on("checkRatio", (bool) => {
        setDesktopRatio(bool);
      });
      /* 아이템 정보를 받음. 이미 똑같은 아이템이라면 아이템 삭제함(동일한 아이템 선택시) */
      socketRef.current.on("starChange", (img) => {
        let myStar = document
          .getElementById("remoteStar")
          .src.split("static")[1];
        document.getElementById("remoteStar").src =
          myStar === img.split("static")[1] ? "" : img;
      });
      /* 아이템을 움직일때마다 스타일정보를 받아서 똑같이 적용함*/
      socketRef.current.on("starLocate", (text) => {
        document.getElementById("RND1").style.cssText = text;
      });
      socketRef.current.on("starLocate2", (text) => {
        document.getElementById("RND2").style.cssText = text;
      });
      /* 내 비율 정보를 전송함 */
      socketRef.current.emit("checkRatio", !isMobile, props.roomName); // 내가 모바일인지 상대방한테 보냄
    }
    /* 위에서 작성한 웹캠 함수 실행 */
    setVideoTracks();

    /* clean up 을 먼저하고 소켓 연결해야함, 위 코드보다 먼저 실행됨 */
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

  /* 배경 정보를 주기적으로 주고받음 */
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
          /* Image를 설정하지 않으면 기본 배경임.*/
          backgroundImage: props.ImgBase64
            ? `url(${props.ImgBase64})`
            : DEFAULT_BACKGROUND,
        }}
      >
        <Rnd
          id="RND1"
          style={{
            zIndex: "999",
          }}
          default={{
            x: 0,
            y: 0,
            width: "30%",
          }}
          bounds="parent" // 부모컴포넌트 내에서만 이동가능(parent or window)
        >
          <img
            id="myStar"
            alt=""
            draggable={false}
            onClick={(e) => {
              /* 아이템을 끌어다 놓으면 소켓으로 CSS 정보를 보냄*/
              e.preventDefault();
              let text = document.getElementById("RND1").style.cssText;
              if (!isSingle)
                socketRef.current.emit("starLocate2", text, props.roomName);
            }}
          />
        </Rnd>
        <Rnd
          id="RND2"
          style={{
            zIndex: "999",
          }}
          default={{
            x: 0,
            y: 0,
            width: "30%",
          }}
          bounds="parent" // 부모컴포넌트 내에서만 이동가능(parent or window)
        >
          <img
            id="remoteStar"
            alt=""
            draggable={false}
            onClick={(e) => {
              /* 아이템을 끌어다 놓으면 소켓으로 CSS 정보를 보냄*/
              e.preventDefault();
              let text = document.getElementById("RND2").style.cssText;
              if (!isSingle)
                socketRef.current.emit("starLocate", text, props.roomName);
            }}
          />
        </Rnd>
        <canvas
          /* 내 누끼 화면 */
          className={
            /* HOST인지, Mobile인지 검사함
              HOST면 z-index가 1이되고, Mobile인 경우 비율이 반대로임 */
            isHost
              ? isMobile
                ? styles.hostMobile
                : styles.host
              : isMobile
              ? styles.guestMobile
              : styles.guest
          }
          /* Mobile인경우 WebGL을 사용하지 않는 방식으로 누끼 땀 */
          id={isMobile ? "transparent_canvas" : "mytrans"}
        ></canvas>
        {!isSingle ? (
          <canvas // @상대방의 누끼화면@
            className={
              /* leave면 캔버스가 사라짐.(나갔을때 굳어있는거 방지)
                내 화면은 isMobile로 판단하고, 상대방은 소켓으로 받은 정보인
                isDesktopRatio를 이용함 */
              leave
                ? styles.displaynone
                : isHost
                ? !isDesktopRatio
                  ? styles.guestMobile
                  : styles.guest
                : !isDesktopRatio
                ? styles.hostMobile
                : styles.host
            }
            /* Mobile인경우 WebGL을 사용하지 않는 방식으로 누끼 땀 */
            id={isMobile ? "remote_transparent_canvas" : "remotetrans"}
          ></canvas>
        ) : undefined}
        /* 내 원본 비디오 */
        <video
          className={styles.displaynone}
          id="my_face"
          autoPlay
          playsInline={true}
          width={isMobile ? "480" : "640"}
          height={isMobile ? "640" : "480"}
          ref={localVideoRef}
        ></video>
        {!isSingle ? (
          <>
            /* 상대방 원본 비디오 */
            <video
              className={styles.displaynone}
              id="remote"
              autoPlay
              playsInline={true}
              width={!isDesktopRatio ? "480" : "640"}
              height={!isDesktopRatio ? "640" : "480"}
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
