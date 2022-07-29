import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MyHeader from "../Header/Header";
import AutoSlides from "./AutoSlides";
import { Modal, Carousel } from "antd";
import 혼자찍기 from "../../img/나만보기.png";
import 같이찍기 from "../../img/같이보기.png";
import 입장하기 from "../../img/enterRoom.png";
import 입장하기P from "../../img/enterRoomP.png";
// import { FieldContext } from "rc-field-form";

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

  const carouselRef = React.createRef();

  const contentStyle = {
    // height: "50%",
    // lineHeight: "200px",
    // height: "200px",
    textAlign: "center",
    justifyContents: "center",
    alignContent: "center",
    // background: "#364d79",
  };

  return (
    <div className="outer_container">
      <MyHeader subTitle="메인 화면" />
      <div
        className="contents_container center"
        style={{
          marginTop: "-15%",
        }}
      >
        <AutoSlides />
      </div>
      <div style={{ display: "flex", height: "74px", margin: "-9% 10% 0 9%" }}>
        <button
          className="button button_gap btn_1"
          style={{ height: "100%", margin: "10px", fontSize: "24px" }}
          onClick={showModal}
        >
          촬영하기
        </button>

        <button
          className="button button_gap btn_2"
          style={{ height: "100%", margin: "10px", fontSize: "24px" }}
          onClick={() => navigate("/album")}
        >
          내 앨범
        </button>

        <button
          className="button button_gap btn_3"
          style={{ height: "100%", margin: "10px", fontSize: "24px" }}
          onClick={() => navigate("/allalbum")}
        >
          전체 앨범
        </button>
      </div>
      <Modal
        title="친구를 초대해서 같이 찍을 수 있어요!"
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
            {/* 이 div는 그대로 놔둘것, 스타일적용 안됨*/}
            <div style={contentStyle}>
              <button
                className="button btn_2"
                onClick={() => navigate(`/group/${token}`)}
                style={{
                  width: "35%",
                  height: "100%",
                  padding: "5%",
                  margin: "5%",
                }}
              >
                <img
                  src={혼자찍기}
                  style={{
                    display: "inline-block",
                    height: "50px",
                  }}
                />
                <img
                  src={입장하기P}
                  style={{
                    display: "inline-block",
                    height: "50px",
                  }}
                />
                <div>혼자 찍기</div>
              </button>

              <button
                className="button btn_1"
                onClick={() => {
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
                />

                <div>같이 찍기</div>
              </button>
            </div>
          </div>

          <div
            style={{
              display: "flex",
            }}
          >
            <div style={contentStyle}>
              <button>링크 공유</button>
              <button>카카오로 공유</button>
              <button
                onClick={() => {
                  carouselRef.current.prev();
                }}
              >
                뒤로가기
              </button>
              <button
                className="button btn_1"
                onClick={() => navigate(`/group/${token}`)}
                style={{
                  width: "20%",
                  height: "100%",
                  padding: "5%",
                  margin: "5%",
                }}
              >
                <img
                  src={입장하기}
                  style={{
                    display: "inline-block",
                    height: "50px",
                  }}
                />
                입장
              </button>
            </div>
          </div>
        </Carousel>
      </Modal>
    </div>
  );
}

export default UserMain;
