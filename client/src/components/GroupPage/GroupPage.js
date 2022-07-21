import React, { useState, useRef, useEffect } from "react";
import styles from "./GroupPage.module.css";
import Socket from "./Socket";
import useInterval from "./useInterval";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import { CopyToClipboard } from "react-copy-to-clipboard";
import domtoimage from "dom-to-image";
import MyHeader from "../Header/Header";
import CameraTab from "./CameraTab";
import MuteBtn from "./MuteBtn";
import CaptureBtn from "./CaptureBtn";

let IMGS = [];

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
  const [imgFile, setImgFile] = useState(null); // 파일 전송을 위한 state
  const [countDown, setCount] = useState(5); // 카운트다운
  const [startCapture, setCapture] = useState(false); //찍으면 카운트가 보임
  const [photoCount, setPhotoCount] = useState(0); // 4장만 찍을 수 있다.
  useEffect(() => {
    //최초 페이지 진입시
    navigator.clipboard.writeText(window.document.location.href).then(() => {
      alert("클립보드에 복사되었습니다.");
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
    if (countDown <= 1) {
      captureFunc();
    }
  }, [countDown]);

  useInterval(
    () => {
      setCount(countDown - 1);
    },
    startCapture ? 1000 : null
  );

  // 캡쳐하는 함수
  function captureFunc() {
    domtoimage
      .toPng(refs.captureAreaRef.current)
      .then((DATA_URL) => {
        IMGS.push(DATA_URL);
        // 다 찍었으면 다시 찍을수 있는 상태로 되돌아감.
        setCount(5);
        setPhotoCount(photoCount + 1);
      })
      .catch(function (error) {
        console.error("oops, something went wrong!", error);
      });
  }

  // 음소거 버튼
  function changeMuteButton() {
    setIsMute(!isMute);
    refs.localVideoRef.current.muted = isMute;
  }

  return (
    <div className="container">
      <MyHeader subTitle="촬영중" onBackUrl="/main" />
      <div className="contents_container">
        <div className={styles.camera_container}>
          <div
            className={styles.box}
            ref={refs.captureAreaRef}
            style={{
              backgroundImage: ImgBase64
                ? `url(${ImgBase64})`
                : "url(https://image.jtbcplus.kr/data/contents/jam_photo/202103/31/381e8930-6c3a-440f-928f-9bc7245323e0.jpg)",
            }}
          >
            <Socket roomName={roomname} ref={refs}></Socket>
          </div>
        </div>

        {startCapture ? (
          <div className={styles.rest_container} id="countdown">
            <p className={styles.count_down_text}>{countDown}</p>
          </div>
        ) : (
          <div className={styles.rest_container} id="cameratab">
            <CameraTab
              ref={tabRefs}
              setImgBase64={setImgBase64}
              ImgBase64={ImgBase64}
            />
          </div>
        )}

        <div className={styles.control_container}>
          <p className={styles.photo_count_text}>{photoCount}/4</p>
          <CaptureBtn startCapture={startCapture} setCapture={setCapture} />
          <MuteBtn changeMuteButton={changeMuteButton} isMute={isMute} />
          {/* <input type="file" id="imgFile" onChange={handleChangeFile} /> */}
        </div>
      </div>
    </div>
  );
}

export default GroupPage;
