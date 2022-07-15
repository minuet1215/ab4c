import React, { useEffect, useRef } from "react";
// import axios from "axios";
import { useParams } from "react-router-dom";
import MyHeader from "../Header/Header";
import { Space, Typography, Button, Select, Layout } from "antd";
const { Text } = Typography;
const { Header, Content, Footer } = Layout;

const io = require("socket.io-client");
const SOCKET_SERVER_URL = "http://localhost:5001";
const pc_config = {
  iceServers: [
    {
      urls: [
        "stun:stun.l.google.com:19302",
        "stun:stun1.l.google.com:19302",
        "stun:stun2.l.google.com:19302",
        "stun:stun3.l.google.com:19302",
        "stun:stun4.l.google.com:19302",
      ],
    },
  ],
};

function VideoCallPage() {
  const room_name = useParams();
  console.log("room_name", room_name);

  const socketRef = useRef();
  const pcRef = useRef();
  let localVideoRef = useRef(null);
  let remoteVideoRef = useRef(null);

  let newPC = new RTCPeerConnection(pc_config);
  let newSocket = io(SOCKET_SERVER_URL);

  async function setVideoTrack() {
    const initial_constraints = {
      audio: true,
      video: { facingMode: "user", width: 600, height: 400 },
    };
    // const camera_constraints = {
    //   audio: true,
    //   video: { deviceId: { exact: deviceId }, width: 600, height: 400 },
    // };
    navigator.mediaDevices
      .getUserMedia(initial_constraints)
      .then((stream) => {
        // console.log("socket test: ", newSocket);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        if (!(pcRef.current && socketRef.current)) return;

        stream.getTracks().forEach((track) => {
          if (!pcRef.current) return;
          pcRef.current.addTrack(track, stream);
        });
        pcRef.current.onicecandidate = (event) => {
          if (event.candidate) {
            if (!socketRef.current) return;
            console.log("onicecandidate");
            socketRef.current.emit("candidate", event.candidate);
          }
        };
        pcRef.current.oniceconnectionstatechange = (event) => {
          console.log(event);
        };
        pcRef.current.ontrack = (event) => {
          console.log("add remotetrack success");
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        };
        socketRef.current.emit(
          "join_room",
          room_name.room_name,
          socketRef.current.id
        );
      })
      .catch((err) => {
        console.log("error: ", err);
      });
  }
  const createOffer = async () => {
    console.log("createOffer");
    if (!(pcRef.current && socketRef.current)) return;
    try {
      const sdp = await pcRef.current.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });
      await pcRef.current.setLocalDescription(new RTCSessionDescription(sdp));
      socketRef.current.emit("offer", sdp);
    } catch (e) {
      console.error(e);
    }
  };
  const createAnswer = async (sdp) => {
    if (!(pcRef.current && socketRef.current)) return;
    try {
      await pcRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
      console.log("answer set remote description success");
      const mySdp = await pcRef.current.createAnswer({
        offerToReceiveVideo: true,
        offerToReceiveAudio: true,
      });
      console.log("create answer");
      await pcRef.current.setLocalDescription(new RTCSessionDescription(mySdp));
      socketRef.current.emit("answer", mySdp);
    } catch (e) {
      console.log("errorrrrrrrrrrrrrrrrrrrrr");
      console.error(e);
    }
  };

  // newSocket.emit("ping_test", { data: "test" }); // test
  // !!
  useEffect(() => {
    // console.log("useEffect");
    socketRef.current = newSocket;
    pcRef.current = newPC;

    socketRef.current.on("all_users", (allUsers) => {
      if (allUsers.length > 0) {
        createOffer();
      }
    });

    socketRef.current.on("getOffer", (sdp) => {
      //console.log(sdp);
      console.log("get offer");
      createAnswer(sdp);
    });

    socketRef.current.on("getAnswer", (sdp) => {
      console.log("get answer");
      if (!pcRef.current) return;
      pcRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
      // console.log(sdp);
    });

    socketRef.current.on("getCandidate", async (candidate) => {
      if (!pcRef.current) return;
      await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      console.log("candidate add success");
    });

    socketRef.current.on("take_photo", () => {
      // console.log("take photo: ", socket.id);
      // takePhoto();
    });

    setVideoTrack();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (pcRef.current) {
        pcRef.current.close();
      }
    };
  });

  // async function getCameras() {
  //   try {
  //     const devices = await navigator.mediaDevices.enumerateDevices();
  //     const cameras = devices.filter((device) => device.kind === "videoinput");
  // const current_camera = my_stream.getVideoTracks()[0];
  // console.log(cameras);
  // cameras.forEach((camera) => {
  //   const option = document.createElement("option");
  //   option.value = camera.deviceId;
  //   option.innerText = camera.label;
  //   if (current_camera.label === camera.label) {
  //     option.selected = true;
  //   }
  //   cameras_select.appendChild(option);
  // });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // const renderCameraSelect = (cameras) => {
  //   return cameras.map((camera) => {});
  // };

  const cameraChangeHandler = () => {
    // // await getMedia(cameras_select.value);
    // getMedia(cameras_select.value);
    // if (peer_connection_object_Array.length > 0) {
    //   const videoTrack = my_stream.getVideoTracks()[0];
    //   peer_connection_object_Array.forEach((peerConnectionObj) => {
    //     const peerConnection = peerConnectionObj.connection;
    //     const videoSender = peerConnection
    //       .getSenders()
    //       .find((sender) => sender.track.kind === "video");
    //     videoSender.replaceTrack(videoTrack);
    //   });
    // }
  };
  const takePhotoBtnHandler = () => {
    //   takePhoto(); // 자기자신
    //   socket.emit("take_photo", room_name); // 방에 있는 모든 사람
  };
  const muteBtnHandler = () => {
    //   my_stream
    //     .getAudioTracks()
    //     .forEach((track) => (track.enabled = !track.enabled));
    //   if (muted) {
    //     mute_btn.innerText = "Mute";
    //     muted = false;
    //   } else {
    //     mute_btn.innerText = "Unmute";
    //     muted = true;
    //   }
  };
  const cameraBtnHandler = () => {
    //   my_stream
    //     .getVideoTracks()
    //     .forEach((track) => (track.enabled = !track.enabled));
    //   if (camera_off) {
    //     camera_btn.innerText = "Turn Camera Off";
    //     camera_off = false;
    //   } else {
    //     camera_btn.innerText = "Turn Camera On";
    //     camera_off = true;
    //   }
  };

  // function takePhoto() {
  //   const photo_canvas = document.getElementById("photo");
  //   const context = photo_canvas.getContext("2d");
  //   context.drawImage(my_face, 0, 0, my_face.width, my_face.height);
  //   // const photo_data = photo_canvas.toDataURL("image/png");
  // }

  // socket code

  // // RTC code

  // function makeConnection() {
  //   console.log(`make connection`);
  //   const my_peer_connection = new RTCPeerConnection({
  //     iceServers: [
  //       {
  //         urls: [
  //           "stun:stun.l.google.com:19302",
  //           "stun:stun1.l.google.com:19302",
  //           "stun:stun2.l.google.com:19302",
  //           "stun:stun3.l.google.com:19302",
  //           "stun:stun4.l.google.com:19302",
  //         ],
  //       },
  //     ],
  //   });

  //   my_peer_connection.addEventListener("icecandidate", handleIce);
  //   my_peer_connection.addEventListener("addstream", handleAddStream);

  //   my_stream
  //     .getTracks()
  //     .forEach((track) => my_peer_connection.addTrack(track, my_stream));

  //   peer_connection_object_Array.push({
  //     connection: my_peer_connection,
  //     local_socket_id: socket.id,
  //   });
  // }

  // function handleIce(data) {
  //   peer_connection_object_Array.forEach((peer_connection_object) => {
  //     if (data.target === peer_connection_object.connection) {
  //       socket.emit(
  //         "ice",
  //         data.candidate,
  //         peer_connection_object.remote_socket_id,
  //         peer_connection_object.remote_index
  //       );
  //     }
  //   });
  // }

  // function handleAddStream(data) {
  //   // console.log(`handle add stream ${data.stream.id}`);
  //   const peerStream = data.stream;
  //   // peer array에서 커넥션 정보 찾아서 스트림 추가
  //   peer_connection_object_Array.forEach((peer_connection_object) => {
  //     if (data.target === peer_connection_object.connection) {
  //       paintPeerFace(peerStream, peer_connection_object.remote_socket_id);
  //     }
  //   });
  // }

  // function paintPeerFace(stream, remote_socket_id) {
  //   const streams = document.querySelector("#streams");

  //   const div = document.createElement("div");
  //   div.id = remote_socket_id;

  //   const video = document.createElement("video");
  //   video.srcObject = stream;
  //   video.autoplay = true;
  //   video.playsInline = true;
  //   video.style.width = "600px";
  //   video.style.height = "400px";

  //   div.appendChild(video);
  //   streams.appendChild(div);
  // }

  // // video control
  // function removeVideo(target_socket_id) {
  //   // console.log(`>>> remove video ${target_socket_id}`);
  //   const streams = document.querySelector("#streams");
  //   const videos_div = streams.querySelectorAll("div");
  //   videos_div.forEach((video_div) => {
  //     if (video_div.id === target_socket_id) {
  //       // console.log(`>> find video ${target_socket_id}`);
  //       streams.removeChild(video_div);
  //     }
  //   });
  // }

  // icon={<CameraOutlined />}
  return (
    <div>
      <MyHeader subTitle="영상 통화 화면" onBackUrl="/lobby" />
      <Layout>
        <Content style={{ padding: "50px 50px" }}>
          <div
            id="control"
            style={{ alignItems: "center", padding: "50px 50px" }}
          >
            <Button id="takePhoto" type="primary" onClick={takePhotoBtnHandler}>
              Take Photo
            </Button>
            <Select
              id="cameras"
              style={{
                width: 120,
              }}
              onInput={cameraChangeHandler}
            ></Select>
            <Button id="mute" onClick={muteBtnHandler}>
              Mute
            </Button>
            <Button id="camera" onClick={cameraBtnHandler}>
              Turn Camera Off
            </Button>
          </div>

          <Space
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100vh",
              flexDirection: "column",
              padding: "50px 50px",
            }}
          >
            <video
              id="myFace"
              autoPlay
              playsInline
              style={{ width: "600px", height: "400px" }}
              ref={localVideoRef}
            ></video>
            {/* <div id="streams"> */}
            {/* <Text>친구들 화면</Text> */}
            <video
              autoPlay
              playsInline
              style={{ width: "600px", height: "400px" }}
              ref={remoteVideoRef}
            ></video>
          </Space>
          {/* </div> */}
          <div id="photos">
            <Text>촬영 결과</Text>
            <canvas id="photo"></canvas>
          </div>
        </Content>
      </Layout>
    </div>
  );
}

export default VideoCallPage;
