import React, { useRef, useEffect, useState, useTransition } from "react";
import { useLocation } from "react-router";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./PhotoEditPage.module.css";
import MyHeader from "../Header/Header";
import { Drawer, Input, Button, Modal } from "antd";
import defaultBg from "../../img/default_background.jpg";
import { toast } from "react-toastify";
import Loading from "../Loading/Loading";
import bgImg1 from "../../img/bgImg1.jpg";
import bgImg2 from "../../img/bgImg2.jpg";
import bgImg3 from "../../img/bgImg3.jpg";
import bgImg4 from "../../img/bgImg4.jpg";
import bgImg5 from "../../img/bgImg5.png";
import bgImg7 from "../../img/bgImg7.png";
import bgImg11 from "../../img/bgImg11.png";

import flowerFrame from "../../img/flower.png";
import cloudFrame from "../../img/cloudFrame.png";
import { v4 as uuidv4 } from "uuid";
import makeGif from "./makeGIF";
import alone_icon from "../../img/나만보기.png";
import together_icon from "../../img/같이보기.png";
import { isMobile } from "react-device-detect";

const img_width = 550;
const img_height = 370;
const gap = 20;
const frame_width = img_width + 2 * gap;
const frame_height = 4 * (img_height + gap) + 300;

function PhotoEditPage() {
  let [isPending, startTransition] = useTransition(); // 현재작업을 우선시하게 해주는거
  const navigate = useNavigate();
  let isPublic = true;
  const [isLoading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [user_id, setUser_id] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [message, setMessage] = useState(undefined);
  const [isGifMode, setGifMode] = useState(false);
  const { state } = useLocation();
  const canvasRef = useRef(null);
  const [bgChange, setBgChange] = useState(defaultBg);
  const [isFrameDrawerVisible, setFrameDrawerVisible] = useState(false);
  const [isMessageDrawerVisible, setMessageDrawerVisible] = useState(false);
  const [isInputMessage, setInputMessage] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  /* 프레임에 작성할 날짜 계산 */
  let now = new Date();
  const DATE_TIME = `${now.getFullYear()}.${("0" + (now.getMonth() + 1)).slice(
    -2
  )}.${("0" + now.getDate()).slice(-2)} ${("0" + now.getHours()).slice(-2)}:${(
    "0" + now.getMinutes()
  ).slice(-2)}`;
  const isAuth = document.cookie;
  // ================= dummy data ================= //
  const images = [
    { src: state.images[state.images.length - 4], x: gap, y: gap },
    {
      src: state.images[state.images.length - 3],
      x: gap,
      y: 1 * (img_height + gap) + gap,
    },
    {
      src: state.images[state.images.length - 2],
      x: gap,
      y: 2 * (img_height + gap) + gap,
    },
    {
      src: state.images[state.images.length - 1],
      x: gap,
      y: 3 * (img_height + gap) + gap,
    },
  ];
  const bgImages = [
    { src: defaultBg, alt: "default" },
    { src: bgImg1, alt: "bgImg1" },
    { src: bgImg2, alt: "bgImg2" },
    { src: bgImg3, alt: "bgImg3" },
    { src: bgImg4, alt: "bgImg4" },
    { src: bgImg5, alt: "bgImg5" },
    { src: flowerFrame, alt: "flower" },
    { src: cloudFrame, alt: "cloud" },
    { src: bgImg7, alt: "bgImg7" },
    { src: bgImg11, alt: "bgImg11" },
  ];
  // ================= dummy data ================= //

  /* 순차적으로 실행되려고 만든 함수임 */
  async function asyncGetImage(e) {
    let img = new Image();
    img.src = e;
    return img;
  }
  /* GIF 만드는함수. */
  async function startMakeGif() {
    const ctx = canvasRef.current.getContext("2d");
    let frames = [];
    /* 가지고있는 사진들을 4개씩 붙이기 위해 2중 for문을 돈다.
      elements에 4장씩 들어있음  */
    for await (const elements of state.gifFrames) {
      /* 뒤로가서 다시 찍는 경우를 대비해서 -4번째부터 자름 (최신 4장)*/
      let slicingArray = elements.slice(-4);
      /* entries()는 파이썬에서 enumerate 같은 존재임. index랑 elem을 둘다 사용할 수있음.
        index에 따라서 그림 그릴 좌표가 달라지므로 사용함. */
      for await (const [index, elem] of slicingArray.entries()) {
        await asyncGetImage(elem).then(async (img) => {
          await ctx.drawImage(
            img,
            gap,
            index * (img_height + gap) + gap,
            img_width,
            img_height
          );
        });
      }
      /* 이렇게 만들어진 프레임은 gif로 엮기위해 하나의 Array 로 만듬*/
      frames.push(await canvasRef.current.toDataURL());
    }
    /* gif를 만들면 true가 반환되도록 만들어져있고
      결과값이 나오면 loading을 false로 만들기 위해 사용 */
    setLoading(!makeGif(frames));
  }

  useEffect(() => {
    /* GIF모드일땐 GIF를 보여주고, 아닌 경우 사진이 담겨있는 cavnas를 보여줌 */
    document.getElementById("canvas").style.display = isGifMode ? "none" : "";
    document.getElementById("result-image").style.display = !isGifMode
      ? "none"
      : "";
  }, [isGifMode]);

  /* 로딩State값이 변하면 로딩창을 띄운다. */
  useEffect(() => {
    document.getElementById("Loading").style.display = isLoading ? "" : "none";
  }, [isLoading]);

  // Drawer 열고 닫기 위한 함수
  const showDrawer = (type) => {
    type === "Frame"
      ? setFrameDrawerVisible(true)
      : setMessageDrawerVisible(true);
  };

  /* 사진에 메시지를 쓰기 위한 함수 */
  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  /* 4장을 프레임에 붙이기 위한 함수. */
  const make4cutImage = (ctx, list) => {
    console.log(list);
    for (const i of list) {
      let img = new Image();
      img.src = i.src;
      img.onload = () => {
        ctx.drawImage(img, i.x, i.y, img_width, img_height);
      };
    }
  };

  useEffect(() => {
    // 화면 렌더링 시 바로 유저 정보 가져오기 (TEST)
    axios.get("/api/users/authen").then((response) => {
      setUserName(response.data.name);
      setUser_id(response.data._id); // _id : ObjectID
      setUserEmail(response.data.email);
    });
  }, []);

  /* 최초 1회, 프레임이 바뀌거나, 메시지가 바뀌면 실행되는 Effect*/
  useEffect(() => {
    setLoading(true); // 작업이 완료될때까지 로딩창 띄움
    if (!canvasRef) return;
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, frame_width, frame_height);
    let img = new Image();
    img.src = bgChange;
    img.onload = function () {
      ctx.drawImage(img, 0, 0, frame_width, frame_height); //배경 그리기
      writeDate(ctx, DATE_TIME); //날짜 입력
      make4cutImage(ctx, images); //4컷 그리기
      if (message) writeMessage(ctx, message); //메시지가 있다면 메시지 입력
      setLoading(false);
      if (!isMobile) startMakeGif(); //모바일이 아니라면 GIF 생성
    };
  }, [bgChange, isInputMessage]);

  /* 날짜 작성 */
  function writeDate(ctx, text) {
    ctx.font = "36px Times New Roman";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.fillText(text, frame_width / 2, frame_height - 60);
  }
  /* 메시지 작성 */
  function writeMessage(ctx, message) {
    ctx.font = "40px sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.fillText(message, frame_width / 2, frame_height - 150);
  }
  /* 앨범 저장 */
  const onSave = (e) => {
    e.preventDefault();
    isPublic = e.target.dataset["value"]; // 공개/비공개 설정
    setConfirmLoading(true); // 모달 열어두기

    // isGifMode -> gif, !isGifMode -> png 판단
    if (isGifMode) {
      const gifImg = document.getElementById("result-image");
      fetch(gifImg.src)
        .then((r) => {
          r.blob()
            .then(async (blob) => sendFormData(blob))
            .catch();
        })
        .catch();
    } else {
      try {
        const canvas = document.getElementById("canvas");
        canvas.toBlob(async (blob) => sendFormData(blob), "image/jpeg", 1.0);
      } catch (err) {}
    }
  };

  async function sendFormData(blob) {
    // uuidv4() : File Original Name
    const file = new File([blob], uuidv4(), {
      lastModified: new Date().getTime(),
      type: blob.type,
    });
    const formData = setFormData(file);

    await axios.post("/api/images/post", formData).then((res) => {
      // isLoading = false;
      setLoading(false);
      setModalVisible(false); // 모달 닫기
      setConfirmLoading(false); // 모달 닫기
      if (res) {
        toast.success("이미지 저장 성공!");
        navigate("/album");
      } else {
        toast.error("이미지 저장 실패");
      }
    });
  }

  function setFormData(file) {
    const formData = new FormData();
    // server req.file
    formData.append("file", file);

    // server req.body
    formData.append("public", isPublic);
    formData.append("id", user_id);
    formData.append("username", userName);
    formData.append("useremail", userEmail);

    return formData;
  }

  const OnLocalSave = () => {
    let now = new Date();
    const save_date_time = `${now.getFullYear()}${now.getMonth()}${now.getDate()}_${now.getHours()}${now.getMinutes()}`;
    const canvas = document.getElementById("canvas");
    const dataUrl = canvas.toDataURL();
    const filename = "4cut_" + save_date_time + ".png";
    let link = document.createElement("a");
    if (typeof link.download === "string") {
      link.href = dataUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open(dataUrl);
    }
  };

  const onSwitchHandler = (e) => {
    // e.preventDefault();
    if (!isMobile) {
      setGifMode(!isGifMode);
    } else {
      alert("모바일에서는 GIF모드를 지원하지 않습니다.");
    }
  };

  return (
    <>
      <div id="photoEdit">
        <div className="outer_container">
          <div id="Loading">
            <Loading />
          </div>
          <MyHeader subTitle="편집중" />
          <div className="contents_container">
            <button
              style={{
                position: "absolute",
                top: "50%",
                left: "90%",
                transform: "translate(-50%, -50%)",
                width: "50px",
                height: "50px",
                backgroundColor: "#efefef",
                borderRadius: "10px",
                border: "0",
                color: "#555555",
                fontWeight: "600",
                cursor: "true",
              }}
              onClick={onSwitchHandler}
            >
              {isGifMode ? "PNG!" : "GIF!"}
            </button>
            <div
              style={{
                justifyContent: "center",
                display: "flex",
              }}
            >
              <div className={styles.canvas_container}>
                <canvas
                  id="canvas"
                  width={frame_width}
                  height={frame_height}
                  style={{
                    backgroundColor: "black",
                  }}
                  className={styles.result_image}
                  ref={canvasRef}
                >
                  Your browser does not support the HTML5 canvas tag.
                </canvas>
                <img
                  id="result-image"
                  alt=""
                  className={styles.result_image}
                ></img>
              </div>
            </div>
            {isAuth && (
              <div id="control-menu" className={styles.control_container}>
                <button
                  className={styles.btn_default}
                  onClick={() => {
                    showDrawer("Frame");
                  }}
                  style={{
                    fontSize: "1.4em",
                    fontWeight: "bold",
                  }}
                >
                  {/* <img src={frame} style={{ height: "100%" }} /> */}
                  프레임 변경
                </button>
                <button
                  className={styles.btn_default}
                  onClick={() => {
                    showDrawer("Message");
                  }}
                  style={{
                    fontSize: "1.4em",
                    fontWeight: "bold",
                  }}
                >
                  {/* <img src={memo} style={{ height: "100%" }} /> */}
                  메모 하기
                </button>
                <button
                  className={styles.btn_pink}
                  onClick={() => {
                    setModalVisible(true);
                  }}
                  style={{
                    fontSize: "1.4em",
                    fontWeight: "bold",
                  }}
                >
                  앨범 저장
                </button>
              </div>
            )}
            {!isAuth && (
              <div id="control-menu" className={styles.control_container}>
                <button className={styles.btn_default} onClick={OnLocalSave}>
                  핸드폰 저장
                </button>
                <button
                  className={styles.btn_pink}
                  onClick={() => navigate("/login")}
                >
                  로그인 하기
                </button>
              </div>
            )}
            <Modal
              className="modalRadius"
              title="저장할 사진의 공개 설정을 선택해 주세요!"
              visible={isModalVisible}
              confirmLoading={confirmLoading}
              onCancel={() => {
                setModalVisible(false);
              }}
              footer={null}
              centered={true}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  whiteSpace: "nowrap",
                }}
              >
                <button
                  className="button btn_3"
                  data-value={false}
                  onClick={onSave}
                  style={{
                    fontSize: "1.4rem",
                    fontWeight: "bold",
                    margin: "1rem",
                    padding: "0 15px",
                  }}
                >
                  <img
                    src={alone_icon}
                    style={{
                      height: "80%",
                      marginRight: "5%",
                    }}
                    alt="안방네컷"
                    data-value={false}
                  />
                  나만 보기
                </button>
                <button
                  className="button btn_1"
                  data-value={true}
                  onClick={onSave}
                  style={{
                    fontSize: "1.4rem",
                    fontWeight: "bold",
                    margin: "1rem",
                  }}
                >
                  <img
                    alt=""
                    src={together_icon}
                    style={{
                      height: "100%",
                      marginRight: "5%",
                    }}
                    data-value={true}
                  />
                  다같이 보기
                </button>
              </div>
            </Modal>

            <Drawer
              title="프레임 선택"
              placement="bottom"
              closable={true}
              onClose={() => {
                setFrameDrawerVisible(false);
              }}
              visible={isFrameDrawerVisible}
              height="31%"
              style={
                window.innerWidth > 600
                  ? {
                      width: "600px",
                      marginLeft: `calc(50vw - 300px)`,
                    }
                  : {}
              }
            >
              <div className={styles.bg_menu_scroll}>
                {bgImages.map((bgImage) => {
                  return (
                    <img
                      src={bgImage.src}
                      key={bgImage.alt}
                      alt={bgImage.alt}
                      draggable={false}
                      onClick={() => {
                        setBgChange(bgImage.src);
                        setFrameDrawerVisible(false);
                      }}
                      style={{
                        padding: "10px",
                        width: "110px",
                        height: "150px",
                      }}
                    ></img>
                  );
                })}
              </div>
            </Drawer>
            <Drawer
              title="메시지 입력"
              placement="bottom"
              closable={true}
              onClose={() => {
                setMessageDrawerVisible(false);
              }}
              visible={isMessageDrawerVisible}
              height="30%"
              style={
                window.innerWidth > 600
                  ? {
                      width: "600px",
                      marginLeft: `calc(50vw - 300px)`,
                    }
                  : {}
              }
            >
              <div>
                <Input
                  placeholder="사진에 대한 설명을 적어주세요!"
                  onChange={(e) => {
                    startTransition(() => {
                      handleChange(e);
                    });
                  }}
                  style={{ width: "85%" }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setMessageDrawerVisible(false);
                      setInputMessage(true);
                    }
                  }}
                />
                <Button
                  onClick={() => {
                    setMessageDrawerVisible(false);
                    setInputMessage(true);
                  }}
                  style={{
                    position: "absolute",
                  }}
                >
                  저장
                </Button>
              </div>
            </Drawer>
          </div>
        </div>
      </div>
    </>
  );
}

export default PhotoEditPage;
