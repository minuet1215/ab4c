import React, { useRef, useEffect, useState } from "react";
import { useLocation } from "react-router";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./PhotoEditPage.module.css";
import MyHeader from "../Header/Header";
import { Drawer, Checkbox, Input, Button } from "antd";
import defaultBg from "../../img/default_background.jpg";
import bgImg2 from "../../img/6.jpg";
import { toast } from "react-toastify";
import Loading from "../Loading/Loading";
import bgImg3 from "../../img/bgImg3.png";
import bgImg4 from "../../img/bgImg4.png";
import bgImg5 from "../../img/bgImg5.png";
import bgImg6 from "../../img/bgImg6.png";
import bgImg7 from "../../img/bgImg7.jpeg";
import bgImg8 from "../../img/bgImg8.jpeg";
import flowerFrame from "../../img/flower.png";
import cloudFrame from "../../img/cloudFrame.png";
import { v4 as uuidv4 } from "uuid";
import makeGif from "./makeGIF";

const img_width = 550;
const img_height = 370;
const gap = 20;
const frame_width = img_width + 2 * gap;
const frame_height = 4 * (img_height + gap) + 300;

function PhotoEditPage() {
  const navigate = useNavigate();
  const [isPublic, SetIsPublic] = useState(true);
  const [isLoading, setLoading] = useState(true);
  // const dispatch = useDispatch();
  const [userName, setUserName] = useState("");
  const [user_id, setUser_id] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isGifMode, setGifMode] = useState(false);
  const { state } = useLocation();

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
    { src: bgImg2, alt: "spring" },
    { src: bgImg3, alt: "bgImg3" },
    { src: bgImg4, alt: "bgImg4" },
    { src: bgImg5, alt: "bgImg5" },
    { src: bgImg6, alt: "bgImg6" },
    { src: bgImg7, alt: "bgImg7" },
    { src: bgImg8, alt: "bgImg8" },
    { src: flowerFrame, alt: "bgImg9" },
    { src: cloudFrame, alt: "cloud" },
  ];
  // ================= dummy data ================= //

  const canvasRef = useRef(null);
  const [bgChange, setBgChange] = useState(defaultBg);
  const [isFrameDrawerVisible, setFrameDrawerVisible] = useState(false);
  const [isMessageDrawerVisible, setMessageDrawerVisible] = useState(false);

  useEffect(() => {
    document.getElementById("canvas").style.display = isGifMode ? "none" : "";
    document.getElementById("result-image").style.display = !isGifMode
      ? "none"
      : "";
  }, [isGifMode]);
  useEffect(() => {
    document.getElementById("Loading").style.display = isLoading ? "" : "none";
  }, [isLoading]);
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
      // console.log("user data :", response.data);
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
    img.onload = async function () {
      await ctx.drawImage(img, 0, 0, frame_width, frame_height);
      writeDate(ctx, date_time);
      writeMessage(ctx, message);
      // 기본 이미지
      if (!isGifMode) {
        images.map((image) => {
          let img = new Image();
          img.src = image.src;
          img.onload = function () {
            ctx.drawImage(img, image.x, image.y, img_width, img_height);
          };
        });
      } else {
        // gif 만들기.
        let frames = [];
        async function temp(e) {
          let img = new Image();
          img.src = e;
          return img;
        }
        console.log(state.gifFrames);
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
      if (!isGifMode) setLoading(false);
    };
  }, [canvasRef, bgChange, isMessageDrawerVisible, isGifMode]);

  function writeDate(ctx, text) {
    ctx.font = "32px sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.fillText(text, frame_width / 2, frame_height - 80);
  }

  function writeMessage(ctx, message) {
    ctx.font = "32px sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.fillText(message, frame_width / 2, frame_height - 120);
  }

  const onSave = (e) => {
    e.preventDefault();

    // isGifMode -> gif, !isGifMode -> png 판단
    if (isGifMode) {
      const gifImg = document.getElementById("result-image");
      fetch(gifImg.src)
        .then((r) => {
          r.blob()
            .then(async (blob) => sendFormData(blob))
            .catch((e) => {
              console.log(e);
            });
        })
        .catch((e) => console.log(e));
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
    <div className="outer_container">
      <div id="Loading">
        <Loading />
      </div>
      <MyHeader subTitle="사진 화면" onBackUrl="/main" />
      <div className="contents_container">
        <div
          className={styles.canvas_container}
          onClick={() => {
            console.log("click");
            setGifMode(!isGifMode);
          }}
        >
          <canvas
            id="canvas"
            width={frame_width}
            height={frame_height}
            style={{
              backgroundColor: "black",
            }}
            ref={canvasRef}
          >
            Your browser does not support the HTML5 canvas tag.
          </canvas>
          <img id="result-image"></img>
        </div>
        {isAuth && (
          <div id="control-menu" className={styles.control_container}>
            {/* <button className={styles.btn_default}>공유</button> */}
            <button
              className={styles.btn_default}
              onClick={() => {
                showDrawer("Frame");
              }}
            >
              프레임 변경
            </button>
            <button
              className={styles.btn_default}
              onClick={() => {
                showDrawer("Message");
              }}
            >
              메모하기
            </button>
            <button className={styles.btn_pink} onClick={onSave}>
              앨범 저장
            </button>
            <Checkbox onChange={() => SetIsPublic(!isPublic)}>비공개</Checkbox>
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

        <Drawer
          title="프레임 선택"
          placement="bottom"
          closable={true}
          onClose={() => {
            setFrameDrawerVisible(false);
          }}
          visible={isFrameDrawerVisible}
          height="31%"
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
                  style={{ padding: "10px", width: "100px", height: "150px" }}
                ></img>
              );
            })}
          </div>
        </Drawer>
        <Drawer
          title="메시지입력"
          placement="bottom"
          closable={true}
          onClose={() => {
            setMessageDrawerVisible(false);
          }}
          visible={isMessageDrawerVisible}
          height="30%"
        >
          <div>
            <Input
              placeholder="사진에 대한 설명을 적어주세요!"
              onChange={handleChange}
              style={{ width: "85%" }}
            />
            <Button
              onClick={() => {
                setMessageDrawerVisible(false);
              }}
              style={{
                position: "absolute",
              }}
            >
              완료
            </Button>
          </div>
        </Drawer>
      </div>
    </div>
  );
}

export default PhotoEditPage;
