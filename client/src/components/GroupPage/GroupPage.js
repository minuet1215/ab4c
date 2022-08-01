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
// import { toast } from "react-toastify";
import cameraAudioSrc from "./audio/camera.mp3"; // 카메라 셔터 음원
// import CountDown from "../CountDown/CountDown";
import FlipNumbers from "react-flip-numbers";
let resultImages = [];
let gifFrames = [[], [], [], [], [], [], [], [], [], [], []];

function GroupPage() {
  const MAX_COUNT = 3.25;
  const [token] = useState(localStorage.getItem("token"));
  let { roomname } = useParams();
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
  const [onClickCapture, setClickCapture] = useState(false);

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
  // 4장 찍으면 edit페이지로 이동
  useEffect(() => {
    if (photoCount === 5) {
      console.log(resultImages);
      cameraOff();
      navigate("/edit", {
        state: { images: resultImages, gifFrames: gifFrames },
      });
    }
  }, [photoCount]); // eslint-disable-line react-hooks/exhaustive-deps

  // 1초마다 초세기. startCapture State가 true가 되면 자동으로 돌아감
  useEffect(() => {
    if (countDown > 0 && countDown < 3 && !isMobile) {
      silentCapture(11 - 4 * countDown);
    } else if (countDown === 0) {
      captureFunc();
    }
  }, [countDown]);

  // 음소거 useeffect (반응 늦는 이슈 수정)
  useEffect(() => {
    if (refs.localVideoRef.current.srcObject) {
      refs.localVideoRef.current.srcObject.getTracks()[0].enabled = isMute;
    }
  }, [isMute]);

  useInterval(
    () => {
      setCount(countDown - 0.25);
    },
    startCapture && countDown > 0 ? 250 : null
  );

  function setInitialState() {
    setCount(MAX_COUNT);
    setPhotoCount(photoCount + 1);
    setCapture(false);
    setTakePhotoLayer({});
  }

  // 캡쳐하는 함수
  async function captureFunc() {
    setTakePhotoLayer({
      backgroundColor: "white",
      opacity: "0.5",
    });
    let audio = new Audio(cameraAudioSrc);
    audio.play();
    if (isMobile) {
      await html2canvas(refs.captureAreaRef.current, {
        allowTaint: false,
        useCORS: true,
        scale: 1,
      }).then(async (canvas) => {
        let dataURL = canvas.toDataURL();
        resultImages.push(dataURL);
      });
    } else {
      domtoimage.toPng(refs.captureAreaRef.current).then((dataUrl) => {
        resultImages.push(dataUrl);
      });
    }
    // 다 찍었으면 다시 찍을수 있는 상태로 되돌아감.
    setInitialState();
  }
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
          <div className={styles.camera_outer_div}>
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
                numbers={Math.floor(countDown).toString()}
                numberStyle={{
                  fontSize: "100px",
                  fontWeight: "700",
                  color: "#555555",
                }}
              />
              {/* <p className={styles.count_down_text}>{Math.floor(countDown)}</p> */}
              {/* <CountDown /> */}
            </div>
          ) : roomname === token ? (
            <div className={styles.rest_container} id="cameratab">
              <CameraTab
                ref={refs}
                setImgBase64={setImgBase64}
                ImgBase64={ImgBase64}
                // starImg={starImg}
              />
            </div>
          ) : (
            <div className={styles.rest_container} id="countdown">
              <div className={styles.member_text}>대기중</div>
            </div>
          )}
          <div className={styles.control_container}>
            <p className={styles.photo_count_text}>{photoCount}/4</p>
            <CaptureBtn
              startCapture={startCapture}
              setCapture={setCapture}
              roomname={roomname}
              token={token}
              ref={refs}
            />
            <MuteBtn setIsMute={setIsMute} isMute={isMute} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroupPage;
