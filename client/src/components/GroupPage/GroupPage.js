import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import styles from "./GroupPage.module.css";
import VideoAREA from "./Socket";
import useInterval from "./useInterval";
import html2canvas from "html2canvas";
import domtoimage from "dom-to-image-improved";
import MyHeader from "../Header/Header";
import CameraTab from "./CameraTab";
import MuteBtn from "./MuteBtn";
import CaptureBtn from "./CaptureBtn";
import { toast } from "react-toastify";
import cameraAudioSrc from "./audio/camera.mp3"; // 카메라 셔터 음원s
import CountDown from "../CountDown/CountDown";

let IMGS = [];
let gifFrames = [[], [], [], [], [], [], []];

function GroupPage() {
  const [token] = useState(localStorage.getItem("token"));
  let { roomname } = useParams();
  const navigate = useNavigate();
  const refs = {
    backgroundSrcRef: useRef(null),
    localVideoRef: useRef(null),
    socketRef: useRef(null),
    pcRef: useRef(null),
    remoteVideoRef: useRef(null),
    captureAreaRef: useRef(null),
  };
  const [ImgBase64, setImgBase64] = useState(""); // 업로드 될 이미지
  const [isMute, setIsMute] = useState(true); // 음소거 변수
  const [countDown, setCount] = useState(5); // 카운트다운
  const [startCapture, setCapture] = useState(false); //찍으면 카운트가 보임
  const [photoCount, setPhotoCount] = useState(1); // 4장만 찍을 수 있다.
  const [takePhotoLayer, setTakePhotoLayer] = useState({});

  useEffect(() => {
    //최초 페이지 진입시
    if (token === roomname) {
      navigator.clipboard.writeText(window.document.location.href).then(() => {
        toast.success("초대링크가 자동으로 복사되었습니다.");
      });
    }
  }, []);

  function cameraOff() {
    refs.socketRef.current.disconnect();
    refs.pcRef.current.close();
    let stream = refs.localVideoRef.current.srcObject;
    stream.getTracks().forEach(function (track) {
      track.stop();
    });
  }
  // 4장 찍으면 edit페이지로 이동
  useEffect(() => {
    if (photoCount === 5) {
      cameraOff();
      navigate("/edit", { state: { images: IMGS, gifFrames: gifFrames } });
    }
  }, [photoCount]); // eslint-disable-line react-hooks/exhaustive-deps

  // 1초마다 초세기. startCapture State가 true가 되면 자동으로 돌아감
  useEffect(() => {
    if (countDown === 0) {
      captureFunc();
    }
    if (countDown > 0 && countDown < 4) {
      silentCapture(2 * countDown - 1);
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
      setCount(countDown - 0.5);
    },
    startCapture && countDown > 0 ? 500 : null
  );

  // 캡쳐하는 함수
  function captureFunc() {
    setTakePhotoLayer({
      backgroundColor: "#ffffff",
      opacity: "0.5",
    });
    let audio = new Audio(cameraAudioSrc);
    audio.play();
    domtoimage.toPng(refs.captureAreaRef.current).then(function (dataUrl) {
      IMGS.push(dataUrl);
      // 다 찍었으면 다시 찍을수 있는 상태로 되돌아감.
      setCount(5);
      setPhotoCount(photoCount + 1);
      setCapture(false);
      setTakePhotoLayer({});
    });
  }
  function silentCapture(index) {
    domtoimage
      .toPng(refs.captureAreaRef.current)
      .then(function (dataUrl) {
        gifFrames[index].push(dataUrl);
      })
      .catch(function (error) {
        console.error("oops, something went wrong!", error);
      });
  }

  return (
    <div className="outer_container" style={takePhotoLayer}>
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
            {/* <p className={styles.count_down_text}>{Math.floor(countDown)}</p> */}
            <CountDown />
          </div>
        ) : roomname === token ? (
          <div className={styles.rest_container} id="cameratab">
            <CameraTab
              ref={refs}
              setImgBase64={setImgBase64}
              ImgBase64={ImgBase64}
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
          />
          <MuteBtn setIsMute={setIsMute} isMute={isMute} />
        </div>
      </div>
    </div>
  );
}

export default GroupPage;
