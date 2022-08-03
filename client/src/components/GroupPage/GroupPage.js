import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { useParams } from "react-router-dom";
import styles from "./GroupPage.module.css";
import VideoAREA from "./Socket";
import useInterval from "./useInterval";
/* for iPhone Users*/
import { isMobile } from "react-device-detect";
import html2canvas from "html2canvas";
/******************/
import domtoimage from "dom-to-image-improved";
import MyHeader from "../Header/Header";
import CameraTab from "./CameraTab";
import MuteBtn from "./MuteBtn";
import CaptureBtn from "./CaptureBtn";
import cameraAudioSrc from "./audio/camera.mp3"; // 카메라 셔터 음원
import FlipNumbers from "react-flip-numbers";

/* image array */
let resultImages = [];
let gifFrames = [[], [], [], [], [], [], [], [], [], [], []];

/* Group Page Component */
function GroupPage() {
  const MAX_COUNT = 3.0; // Total Seconds
  const [token] = useState(localStorage.getItem("token")); //login token
  let { roomname } = useParams(); //Room name
  const { state } = useLocation();
  const navigate = useNavigate();
  const refs = {
    backgroundSrcRef: useRef(null),
    localVideoRef: useRef(null),
    socketRef: useRef(null),
    pcRef: useRef(null),
    remoteVideoRef: useRef(null),
    captureAreaRef: useRef(null),
    SocketMessageRef: useRef(null),
  };
  const [ImgBase64, setImgBase64] = useState(""); // 업로드 될 이미지
  const [isMute, setIsMute] = useState(true); // 음소거 변수
  const [countDown, setCount] = useState(MAX_COUNT); // 카운트다운
  const [startCapture, setCapture] = useState(false); //찍으면 카운트가 보임
  const [photoCount, setPhotoCount] = useState(1); // 4장만 찍을 수 있다.
  const [takePhotoLayer, setTakePhotoLayer] = useState({});

  /* 촬영 종료되면 카메라 끄기 */
  function cameraOff() {
    if (!state.isSingle) {
      refs.socketRef.current.disconnect();
      refs.pcRef.current.close();
    }
    let stream = refs.localVideoRef.current.srcObject;
    stream.getTracks().forEach(function (track) {
      track.stop();
    });
  }

  /* 1초마다 초세기. */
  useEffect(() => {
    if (countDown > 0 && countDown < 3 && !isMobile) {
      silentCapture(11 - 4 * countDown);
    } else if (countDown === 0) {
      captureFunc();
    }
  }, [countDown]);

  /* 음소거 버튼을 눌렀을때 use Effect */
  useEffect(() => {
    if (refs.localVideoRef.current.srcObject) {
      refs.localVideoRef.current.srcObject.getTracks()[0].enabled = isMute;
    }
  }, [isMute]);

  /* 0.25초마다 카운트다운을 0.25씩 줄어들게 함. */
  useInterval(
    () => {
      setCount(countDown - 0.25);
    },
    startCapture && countDown > 0 ? 250 : null
  );

  /* 사진을 찍을 때마다 실행되는 초기화 함수 */
  function setInitialState() {
    if (photoCount === 4) {
      console.log(resultImages);
      navigate("/edit", {
        state: { images: resultImages, gifFrames: gifFrames },
      });
      cameraOff();
      return;
    }
    setCount(MAX_COUNT);
    setPhotoCount(photoCount + 1);
    setCapture(false);
    setTakePhotoLayer({});
  }

  /* 캡쳐 함수 */
  async function captureFunc() {
    let audio = new Audio(cameraAudioSrc);
    audio.play();
    setTakePhotoLayer({
      backgroundColor: "white",
      opacity: "0.5",
    });
    /* 모바일일 경우 html2cavnas 모듈 사용*/
    if (isMobile) {
      await html2canvas(refs.captureAreaRef.current, {
        allowTaint: false,
        useCORS: true,
        scale: 1,
      }).then(async (canvas) => {
        let dataURL = canvas.toDataURL();
        resultImages.push(dataURL);
      });
      /* PC일경우 domtoImage 모듈 사용*/
    } else {
      await domtoimage
        .toPng(refs.captureAreaRef.current)
        .then(async (dataUrl) => {
          await resultImages.push(dataUrl);
        });
    }
    /* 초기화 함수 */
    setInitialState();
  }

  /* GIF에 필요한 프레임 촬영을 위한 함수 (모바일에선 작동 X) */
  function silentCapture(index) {
    domtoimage
      .toPng(refs.captureAreaRef.current)
      .then((dataUrl) => {
        gifFrames[index].push(dataUrl);
      })
      .catch((error) => {
        console.log("capture error", error);
      });
  }

  return (
    <div className="outer_container">
      <div style={takePhotoLayer}>
        <MyHeader subTitle="촬영중" onBackUrl="/main" onClick={cameraOff} />
        <div className="contents_container">
          <div
            className={
              window.innerWidth > 600
                ? styles.camera_outer_div_over_600
                : styles.camera_outer_div
            }
          >
            <div className={styles.camera_container}>
              <VideoAREA
                roomName={roomname}
                ref={refs}
                ImgBase64={ImgBase64}
                setImgBase64={setImgBase64}
                isCapture={startCapture}
                setCapture={setCapture}
                token={token}
                isSingle={state?.isSingle || false}
              ></VideoAREA>
            </div>
          </div>
          {startCapture ? (
            <div
              className={styles.rest_container}
              id="countdown"
              style={{
                justifyContent: "center",
                display: "flex",
                alignItems: "center",
              }}
            >
              <FlipNumbers
                height={150}
                width={150}
                play
                numbers={Math.ceil(countDown).toString()}
                numberStyle={{
                  fontSize: "100px",
                  fontWeight: "700",
                  color: "#555555",
                }}
              />
              {/* <p className={styles.count_down_text}>{Math.floor(countDown)}</p> */}
              {/* <CountDown /> */}
            </div>
          ) : (
            <div className={styles.rest_container} id="cameratab">
              <CameraTab
                ref={refs}
                setImgBase64={setImgBase64}
                ImgBase64={ImgBase64}
                roomname={roomname}
                token={token}
              />
            </div>
          )}
          <div className={styles.control_container}>
            <p id="photo-count" className={styles.photo_count_text}>
              {photoCount}/4
            </p>
            <CaptureBtn
              startCapture={startCapture}
              setCapture={setCapture}
              roomname={roomname}
              token={token}
              ref={refs}
            />
            {!state?.isSingle ? (
              <MuteBtn setIsMute={setIsMute} isMute={isMute} />
            ) : undefined}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroupPage;
