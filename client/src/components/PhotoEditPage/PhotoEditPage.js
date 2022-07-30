import React, { useRef, useEffect, useState } from "react";
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
import bgImg12 from "../../img/bgImg12.png";
import flowerFrame from "../../img/flower.png";
import cloudFrame from "../../img/cloudFrame.png";
import { v4 as uuidv4 } from "uuid";
import makeGif from "./makeGIF";
// import frame from "../../img/frame.png";
// import memo from "../../img/memo.png";
// import album from "../../img/album.png";
import alone_icon from "../../img/나만보기.png";
import together_icon from "../../img/같이보기.png";
import { isMobile } from "react-device-detect";
import PrintPage from "./PrintPage";

const img_width = 550;
const img_height = 370;
const gap = 20;
const frame_width = img_width + 2 * gap;
const frame_height = 4 * (img_height + gap) + 300;

function PhotoEditPage() {
  const navigate = useNavigate();
  // const [isPublic, SetIsPublic] = useState(true);
  let isPublic = true;
  const [isLoading, setLoading] = useState(true);
  // const dispatch = useDispatch();
  const [userName, setUserName] = useState("");
  const [user_id, setUser_id] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isGifMode, setGifMode] = useState(false);
  const { state } = useLocation();
  const [isPrintStart, setPrintStart] = useState(undefined);
  const [isPrintEnd, setPrintEnd] = useState(false);

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
    { src: bgImg12, alt: "bgImg12" },
  ];
  // ================= dummy data ================= //

  const canvasRef = useRef(null);
  const [bgChange, setBgChange] = useState(defaultBg);
  const [isFrameDrawerVisible, setFrameDrawerVisible] = useState(false);
  const [isMessageDrawerVisible, setMessageDrawerVisible] = useState(false);
  const [isInputMessage, setInputMessage] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showModal = () => {
    setModalVisible(true);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
  };
  async function temp(e) {
    let img = new Image();
    img.src = e;
    return img;
  }
  async function startMakeGif() {
    const ctx = canvasRef.current.getContext("2d");
    let frames = [];
    for await (const elements of state.gifFrames) {
      let j = -1;
      let slicingArray = elements.slice(-4);
      for await (const elem of slicingArray) {
        await temp(elem)
          .then(async (img) => {
            await ctx.drawImage(
              img,
              gap,
              j * (img_height + gap) + gap,
              img_width,
              img_height
            );
          })
          .then(j++);
      }
      frames.push(await canvasRef.current.toDataURL());
    }
    setLoading(!makeGif(frames));
  }

  useEffect(() => {
    document.getElementById("canvas").style.display = isGifMode ? "none" : "";
    document.getElementById("result-image").style.display = !isGifMode
      ? "none"
      : "";
  }, [isGifMode]);

  useEffect(() => {
    document.getElementById("Loading").style.display = isLoading ? "" : "none";
  }, [isLoading]);

  useEffect(() => {
    if (isPrintEnd === true) {
      document.getElementById("photoEdit").style.display = "";
      document.getElementById("PrintPage").style.display = "none";
      startMakeGif();
    }
  }, [isPrintEnd]);
  const showDrawer = (type) => {
    type === "Frame"
      ? setFrameDrawerVisible(true)
      : setMessageDrawerVisible(true);
  };

  const handleChange = (event) => {
    setMessage(event.target.value);
  };
  const isAuth = document.cookie;

  useEffect(() => {
    setLoading(true);
    // 화면 렌더링 시 바로 유저 정보 가져오기 (TEST)
    axios.get("/api/users/authen").then((response) => {
      setUserName(response.data.name);
      setUser_id(response.data._id); // _id : ObjectID
      setUserEmail(response.data.email);
    });
    let now = new Date();
    let month =
      now.getMonth() + 1 < 10 ? "0" + (now.getMonth() + 1) : now.getMonth() + 1;
    let date = now.getDate() < 10 ? "0" + now.getDate() : now.getDate();
    let hour = now.getHours() < 10 ? "0" + now.getHours() : now.getHours();
    let minute =
      now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes();
    const date_time =
      now.getFullYear() + "." + month + "." + date + " " + hour + ":" + minute;

    if (!canvasRef) return;
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, frame_width, frame_height);

    let img = new Image();
    img.src = bgChange;
    img.onload = function () {
      if (!isMobile) startMakeGif();
      const make4cutImage = async (ctx, list) => {
        for await (const image of list) {
          await temp(image).then(async (i) => {
            await ctx.drawImage(i, image.x, image.y, img_width, img_height);
          });
        }
        if (!isPrintEnd) setPrintStart(canvasRef.current.toDataURL());
      };
      ctx.drawImage(img, 0, 0, frame_width, frame_height);
      make4cutImage(ctx, images);
      writeDate(ctx, date_time);
      writeMessage(ctx, message);
      // 기본 이미지
      setLoading(false);
    };
  }, [canvasRef, bgChange, isInputMessage]);

  function writeDate(ctx, text) {
    ctx.font = "36px Times New Roman";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.fillText(text, frame_width / 2, frame_height - 60);
  }

  function writeMessage(ctx, message) {
    ctx.font = "40px sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.fillText(message, frame_width / 2, frame_height - 150);
  }

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
    const date_time = `${now.getFullYear()}${now.getMonth()}${now.getDate()}_${now.getHours()}${now.getMinutes()}`;
    const canvas = document.getElementById("canvas");
    const dataUrl = canvas.toDataURL();
    const filename = "4cut_" + date_time + ".png";
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

  return (
    <>
      <div id="PrintPage">
        <PrintPage
          isPrintStart={isPrintStart}
          setPrintEnd={setPrintEnd}
        ></PrintPage>
      </div>
      <div id="photoEdit" style={{ display: "none" }}>
        <div className="outer_container">
          <div id="Loading">
            <Loading />
          </div>
          <MyHeader subTitle="사진 화면" onBackUrl="/main" />
          <div className="contents_container">
            <div
              style={{
                justifyContent: "center",
                display: "flex",
                marginBottom: "5%",
              }}
            >
              <div
                className={styles.canvas_container}
                onClick={(e) => {
                  e.preventDefault();
                  if (!isMobile) {
                    setGifMode(!isGifMode);
                  } else {
                    alert("모바일에서는 GIF모드를 지원하지 않습니다.");
                  }
                }}
              >
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
                <img id="result-image" alt=""></img>
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
                  onClick={showModal}
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
              title="저장할 사진의 공개 설정을 선택해 주세요!"
              visible={isModalVisible}
              confirmLoading={confirmLoading}
              onCancel={handleModalCancel}
              footer={null}
              centered={true}
            >
              <div style={{ display: "flex" }}>
                <button
                  className="button btn_3"
                  data-value={false}
                  onClick={onSave}
                  style={{
                    fontSize: "1.4em",
                    fontWeight: "bold",
                    margin: "1rem",
                  }}
                >
                  <img
                    src={alone_icon}
                    style={{
                      // display: "block",
                      // justifyContent: "center",
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
                    fontSize: "1.4em",
                    fontWeight: "bold",
                    margin: "1rem",
                  }}
                >
                  <img
                    alt=""
                    src={together_icon}
                    style={{ height: "100%", marginRight: "5%" }}
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
                  onChange={handleChange}
                  style={{ width: "85%" }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") setMessageDrawerVisible(false);
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
