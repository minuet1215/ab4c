import React, { useState, useRef, useEffect } from "react";
import styles from "./GroupPage.module.css";
import Socket from "./Socket";
import useInterval from "./useInterval";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import { CopyToClipboard } from "react-copy-to-clipboard";
import domtoimage from "dom-to-image";

let IMGS = [];

function GroupPage() {
  let { roomname } = useParams();
  const navigate = useNavigate();
  const refs = {
    localVideoRef: useRef(null),
    socketRef: useRef(null),
    pcRef: useRef(null),
    remoteVideoRef: useRef(null),
    captureAreaRef: useRef(null),
  };
  const [ImgBase64, setImgBase64] = useState(""); // 업로드 될 이미지
  const [imgFile, setImgFile] = useState(null); // 파일 전송을 위한 state
  let isMute = false; // 음소거 변수
  const [countDown, setCount] = useState(5); // 카운트다운
  const [startCapture, setCapture] = useState(false); //찍으면 카운트가 보임
  const [photoCount, setPhotoCount] = useState(0); // 4장만 찍을 수 있다.
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
    if (countDown <= 0) {
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
    isMute = !isMute;
    refs.localVideoRef.current.muted = isMute;

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
    }
  };
  return (
    <div>
      {!startCapture ? (
        <button
          onClick={() => {
            setCapture(true);
          }}
        >
          캡쳐
        </button>
      ) : undefined}

      <button
        id="muteButton"
        onClick={() => {
          changeMuteButton();
        }}
      >
        Mute
      </button>
      <CopyToClipboard
        text={window.document.location.href}
        onCopy={() => {
          alert("복사완료");
        }}
      >
        <button>초대링크복사</button>
      </CopyToClipboard>
      <input type="file" id="imgFile" onChange={handleChangeFile} />
      <div
        className={styles.box}
        // id="capture"
        ref={refs.captureAreaRef}
        style={{
          backgroundImage: ImgBase64
            ? `url(${ImgBase64})`
            : "url(https://image.jtbcplus.kr/data/contents/jam_photo/202103/31/381e8930-6c3a-440f-928f-9bc7245323e0.jpg)",
        }}
      >
        <Socket
          roomName={roomname}
          isCapture={startCapture}
          setCapture={setCapture}
          bgimg={ImgBase64}
          setBgImg={setImgBase64}
          ref={refs}
        ></Socket>
      </div>
      {startCapture && <p style={{ fontSize: "xx-large" }}>{countDown}</p>}
      <p>{photoCount}/4</p>
    </div>
  );
}

export default GroupPage;
