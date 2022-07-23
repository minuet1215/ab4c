import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import styles from "./GroupPage.module.css";
import VideoAREA from "./Socket";
import useInterval from "./useInterval";
import html2canvas from "html2canvas";
import MyHeader from "../Header/Header";
import CameraTab from "./CameraTab";
import MuteBtn from "./MuteBtn";
import CaptureBtn from "./CaptureBtn";
import { toast } from "react-toastify";
import cameraAudioSrc from "./audio/camera.mp3"; // 카메라 셔터 음원

let IMGS = [];
const token = localStorage.getItem("token");

function GroupPage() {
  let { roomname } = useParams();
  const navigate = useNavigate();
  const tabRefs = {
    backgroundSrcRef: useRef(null),
  };
  const refs = {
    localVideoRef: useRef(null),
    socketRef: useRef(null),
    pcRef: useRef(null),
    remoteVideoRef: useRef(null),
    captureAreaRef: useRef(null),
  };
  const [ImgBase64, setImgBase64] = useState(""); // 업로드 될 이미지
  const [isMute, setIsMute] = useState(false); // 음소거 변수
  const [countDown, setCount] = useState(5); // 카운트다운
  const [startCapture, setCapture] = useState(false); //찍으면 카운트가 보임
  const [photoCount, setPhotoCount] = useState(0); // 4장만 찍을 수 있다.
  const [takePhotoLayer, setTakePhotoLayer] = useState({});

  useEffect(() => {
    //최초 페이지 진입시
    navigator.clipboard.writeText(window.document.location.href).then(() => {
      toast.success("초대링크가 자동으로 복사되었습니다.");
    });
  }, []);
  // 4장 찍으면 edit페이지로 이동
  useEffect(() => {
    if (photoCount === 4) {
      refs.socketRef.current.disconnect();
      refs.pcRef.current.close();
      let stream = refs.localVideoRef.current.srcObject;
      stream.getTracks().forEach(function (track) {
        track.stop();
      });
      navigate("/edit", { state: { images: IMGS } });
    }
  }, [photoCount]); // eslint-disable-line react-hooks/exhaustive-deps

  // 1초마다 초세기. startCapture State가 true가 되면 자동으로 돌아감
  useEffect(() => {
    if (countDown === 0) {
      captureFunc();
    }
  }, [countDown]);

  // 음소거 useeffect (반응 늦는 이슈 수정)
  useEffect(() => {
    refs.localVideoRef.current.muted = isMute;
  }, [isMute]);

  useInterval(
    () => {
      setCount(countDown - 1);
    },
    startCapture && countDown > 0 ? 1000 : null
  );

  // 캡쳐하는 함수
  function captureFunc() {
    let audio = new Audio(cameraAudioSrc);
    audio.play();
    setTakePhotoLayer({
      backgroundColor: "#ffffff",
      opacity: "0.5",
    });
    html2canvas(refs.captureAreaRef.current, {
      allowTaint: false,
      useCORS: true,
      scale: 1,
    }).then((canvas) => {
      let DATA_URL = canvas.toDataURL();
      IMGS.push(DATA_URL);
      // 다 찍었으면 다시 찍을수 있는 상태로 되돌아감.
      setTakePhotoLayer({});
      setCount(5);
      setPhotoCount(photoCount + 1);
    });
  }

  return (
    <div className="size_fix_box">
      <div className="container" style={takePhotoLayer}>
        <MyHeader subTitle="촬영중" onBackUrl="/main" />
        <div className="contents_container">
          <div className={styles.camera_container}>
            <VideoAREA
              roomName={roomname}
              ref={refs}
              ImgBase64={ImgBase64}
              setImgBase64={setImgBase64}
              isCapture={startCapture}
              setCapture={setCapture}
            ></VideoAREA>
          </div>
          {startCapture ? (
            <div className={styles.rest_container} id="countdown">
              <p className={styles.count_down_text}>{countDown}</p>
            </div>
          ) : roomname === token ? (
            <div className={styles.rest_container} id="cameratab">
              <CameraTab
                ref={tabRefs}
                setImgBase64={setImgBase64}
                ImgBase64={ImgBase64}
              />
            </div>
          ) : undefined}
          {/* todo : 참여자는 건들 수 없다는거 알려주기*/}
          <div className={styles.control_container}>
            <p className={styles.photo_count_text}>{photoCount}/4</p>
            <CaptureBtn
              startCapture={startCapture}
              setCapture={setCapture}
              roomname={roomname}
            />
            <MuteBtn setIsMute={setIsMute} isMute={isMute} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroupPage;
