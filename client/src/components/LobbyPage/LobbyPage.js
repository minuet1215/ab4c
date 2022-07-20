import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { enterRoom } from "../../_actions/room_action";
import { Layout, Menu, Form, Input, Button } from "antd";
import MyHeader from "../Header/Header";

function LobbyPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { Header, Content, Footer } = Layout;

  const [RoomNumber, setRoomNumber] = useState("");
  const onRoomNumberHandler = (event) => {
    setRoomNumber(event.currentTarget.value);
  };

  const onEnterRoomBtnHandler = (event) => {
    event.preventDefault();

    console.log(RoomNumber);
    if (!RoomNumber) {
      return alert("> 그룹에 참가할 수 없습니다.");
    }

    let body = {
      roomNumber: RoomNumber,
    };

    dispatch(enterRoom(body)).then((response) => {
      if (response.payload.success) {
        navigate("/video_call/" + body.roomNumber); // 페이지 이동
      } else {
        alert("그룹에 참가할 수 없습니다.");
      }
    });
  };
  return (
    <div>
      <MyHeader subTitle="메인 화면" />

      <Layout>
        <Header>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["1"]}
            items={new Array(5).fill(null).map((_, index) => {
              const key = index + 1;
              return {
                key,
                label: `nav ${key}`,
              };
            })}
          />
        </Header>

        <Content style={{ padding: "50px 50px" }}>
          <Form
            layout="inline"
            style={{ padding: "24px", justifyContent: "center" }}
          >
            <Form.Item
              label="그룹 번호"
              rules={[
                {
                  required: true,
                  message: "그룹 번호를 입력해주세요.",
                },
              ]}
            >
              <Input value={RoomNumber} onChange={onRoomNumberHandler} />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                onClick={onEnterRoomBtnHandler}
              >
                그룹 참가
              </Button>
            </Form.Item>
          </Form>
          <div
            style={{ minHeight: "280px", padding: "24px", background: "#fff" }}
          >
            내용 없음
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>안방 네컷</Footer>
      </Layout>
    </div>
  );
}

export default LobbyPage;
