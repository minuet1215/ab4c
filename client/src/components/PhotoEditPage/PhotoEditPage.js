import React, { useRef, useEffect, useState } from "react";
import { useLocation } from "react-router";
import axios from "axios";
import styles from "./PhotoEditPage.module.css";
import MyHeader from "../Header/Header";
import { Drawer, Checkbox, Input, Button } from "antd";
import defaultBg from "../../img/default_background.jpg";
import bgImg2 from "../../img/6.jpg";
import { toast } from "react-toastify";
// import { auth } from "../../_actions/user_action";
// import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";

const img_width = 550;
const img_height = 370;
const gap = 20;
const frame_width = img_width + 2 * gap;
const frame_height = 4 * (img_height + gap) + 300;

function PhotoEditPage() {
  const [isPublic, SetIsPublic] = useState(true);
  // const dispatch = useDispatch();
  const [userName, setUserName] = useState("");
  const [user_id, setUser_id] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [message, setMessage] = useState("");

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
  ];
  // ================= dummy data ================= //

  const canvasRef = useRef(null);
  const [bgChange, setBgChange] = useState(defaultBg);
  const [isFrameDrawerVisible, setFrameDrawerVisible] = useState(false);
  const [isMessageDrawerVisible, setMessageDrawerVisible] = useState(false);

  const showDrawer = (type) => {
    type === "Frame"
      ? setFrameDrawerVisible(true)
      : setMessageDrawerVisible(true);
  };

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  useEffect(() => {
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
    img.onload = function () {
      ctx.drawImage(img, 0, 0, frame_width, frame_height);
      writeDate(ctx, date_time);
      writeMessage(ctx, message);
      images.map((image) => {
        let img = new Image();
        img.src = image.src;
        img.onload = function () {
          ctx.drawImage(img, image.x, image.y, img_width, img_height);
        };
      });
    };
  }, [canvasRef, bgChange, isMessageDrawerVisible]);

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

    // dispatch(auth()).then((response) => {
    //   setUserName(response.payload.name);
    //   setUser_id(response.payload._id); // _id : ObjectID
    //   setUserEmail(response.payload.email);
    // });

    const canvas = document.getElementById("canvas");
    canvas.toBlob(
      async function (blob) {
        // uuidv4() : File Original Name
        const file = new File([blob], uuidv4(), {
          lastModified: new Date().getTime(),
          type: blob.type,
        });

        const formData = new FormData();
        // server req.file
        formData.append("file", file);

        // server req.body
        formData.append("public", isPublic);
        formData.append("id", user_id);
        formData.append("username", userName);
        formData.append("useremail", userEmail);
        await axios.post("/api/images/post", formData).then((res) => {
          if (res) {
            toast.success("이미지 저장 성공!");
          } else {
            toast.error("이미지 저장 실패");
          }
        });
      },
      "image/jpeg",
      1.0
    );
  };

  return (
    <div className="container">
      <MyHeader subTitle="사진 화면" onBackUrl="/main" />
      <div className="contents_container">
        <div className={styles.canvas_container}>
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
        </div>
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

          {/* <form onSubmit={onSave}>
            <input
              type="checkbox"
              id="public-check"
              value={!isPublic}
              onChange={() => SetIsPublic(!isPublic)}
            ></input>
            <label htmlFor="public-check">비공개</label>
            <button className={styles.btn_pink} type="submit">
              앨범 저장
            </button>
          </form> */}
        </div>

        <Drawer
          title="프레임 선택"
          placement="bottom"
          closable={true}
          onClose={() => {
            setFrameDrawerVisible(false);
          }}
          visible={isFrameDrawerVisible}
          height="30%"
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
            />
            <button
              onClick={() => {
                setMessageDrawerVisible(false);
              }}
            />
            완료
          </div>
        </Drawer>
      </div>
    </div>
  );
}

export default PhotoEditPage;
