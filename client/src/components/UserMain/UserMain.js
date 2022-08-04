import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MyHeader from "../Header/Header";
import { Modal, Carousel } from "antd";
import 혼자찍기 from "../../img/나만보기.png";
import 같이찍기 from "../../img/같이보기.png";
import 입장하기 from "../../img/enterRoom.png";
import 뒤로가기 from "../../img/prevIcon.png";
import 링크복사 from "../../img/linkIcon.png";
import KakaoInviteButton from "../Kakao/KakaoInvite";
import { toast } from "react-toastify";
import albumImg from "../../img/albumImg.png";
import cameraImg from "../../img/cameraImg.png";
import { eventTrack } from "../GA/GA";
function UserMain() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [isModalVisible, setModalVisible] = useState(false);

  const showModal = () => {
    setModalVisible(true);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    carouselRef.current.goTo(0);
  };
  //
  const carouselRef = React.createRef();

  const contentStyle = {
    textAlign: "center",
    justifyContents: "center",
    alignItems: "center",
  };

  const contentStyle2 = {
    display: "flex",
    textAlign: "center",
    alignItems: "center",
  };

  return (
    <div className="outer_container">
      <MyHeader />
      <div
        className="contents_container center"
        style={{
          alignItems: "center",
          // marginTop: "-15%",
        }}
      >
        <button
          className="button button_gap btn_1"
          style={{
            height: "100%",
            width: "65%",
            margin: "30px",
            fontSize: "4vh",
            border: "1px solid #ccc",
          }}
          onClick={showModal}
        >
          <img src={cameraImg} style={{ height: "100px" }} alt="카메라이미지" />
          <div>촬영하기</div>
        </button>

        <button
          className="button button_gap btn_2"
          style={{
            height: "100%",
            width: "65%",
            margin: "30px",
            fontSize: "4vh",
            border: "1px solid #ccc",
          }}
          onClick={() => navigate("/album")}
        >
          <img src={albumImg} style={{ height: "100px" }} alt="앨범이미지" />
          <div>사진첩</div>
        </button>
      </div>

      <Modal
        className="modalRadius"
        title="링크로 친구를 초대하고 입장하세요"
        visible={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
        centered={true}
      >
        <Carousel ref={carouselRef} dots={null}>
          <div
            style={{
              display: "flex",
            }}
          >
            <div style={contentStyle}>
              <button
                className="button btn_2"
                onClick={() => {
                  eventTrack("Button", "alonePhoto", "filming");
                  navigate(`/group/${token}`, { state: { isSingle: true } });
                }}
                style={{
                  width: "35%",
                  height: "100%",
                  padding: "5%",
                  margin: "5%",
                  border: "1px solid #ccc",
                }}
              >
                <img
                  src={혼자찍기}
                  style={{
                    display: "inline-block",
                    height: "50px",
                  }}
                  alt="혼자찍기"
                />
                <div>혼자 찍기</div>
              </button>
              <button
                className="button btn_1"
                onClick={() => {
                  eventTrack("Button", "togetherPhoto", "filming");
                  carouselRef.current.next();
                }}
                style={{
                  width: "35%",
                  height: "100%",
                  padding: "5%",
                  margin: "5%",
                  color: "#3b3b3b",
                }}
              >
                <img
                  src={같이찍기}
                  style={{ height: "50px", display: "inline-block" }}
                  alt=""
                />

                <div>둘이 찍기</div>
              </button>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              textAlign: "center",
              justifyContents: "space-evenly",
              alignItems: "center",
            }}
          >
            <div className="enterRoomModal" style={contentStyle2}>
              <button
                className="btn_3"
                onClick={() => {
                  carouselRef.current.prev();
                }}
                style={{
                  width: "40px",
                  height: "50px",
                  color: "#555555",
                  borderRadius: "10px",
                  border: "0",
                  position: "absolute",
                  top: "30%",
                  left: "40%",
                  padding: "0% 0% 0% 0.3%",
                  boxShadow: "none",
                }}
              >
                <img
                  src={뒤로가기}
                  style={{
                    height: "30px",
                  }}
                  alt=""
                />
              </button>
              <div
                style={{
                  display: "inline-block",
                  width: "38%",
                  margin: "5% 3% 5% 3%",
                }}
              >
                <button
                  className="button btn_2"
                  onClick={() => {
                    navigator.clipboard
                      .writeText("https://www.4cut.shop/group/" + `${token}`)
                      .then(() => {
                        toast.success(
                          <div>
                            초대링크가 복사되었습니다. <br />
                            함께 할 친구를 초대해보세요!
                          </div>,
                          { position: toast.POSITION.UPPER_RIGHT }
                        );
                      });
                  }}
                  style={{
                    // display: "inline-block",
                    width: "100%",
                    height: "30%",
                    padding: "3%",
                    margin: "5% 3% 5% 3%",
                    fontSize: "16px",
                    border: "1px solid #ccc",
                  }}
                >
                  <img
                    src={링크복사}
                    style={{
                      display: "inline-block",
                      height: "25px",
                    }}
                    alt=""
                  />
                  초대링크 복사
                </button>
                <KakaoInviteButton path={`group/${token}`} />
              </div>
              <button
                className="button btn_1"
                onClick={() =>
                  navigate(`/group/${token}`, {
                    state: { isSingle: false },
                  })
                }
                style={{
                  display: "inline-block",
                  width: "25%",
                  height: "100%",
                  padding: "3%",
                  margin: "5% 3% 5% 3%",
                  fontSize: "16px",
                  color: "#3b3b3b",
                }}
              >
                <img
                  src={입장하기}
                  style={{
                    display: "inline-block",
                    height: "50px",
                  }}
                  alt=""
                />
                <div>입장하기</div>
              </button>
            </div>
          </div>
        </Carousel>
      </Modal>
    </div>
  );
}

export default UserMain;
