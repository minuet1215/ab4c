const socket = io();

const take_photo_btn = document.querySelector("#take_photo");
const my_face = document.getElementById("my_face");
const remote = document.getElementById("remote");
const remoteGreen = document.getElementById("remotegreen");
const remotetrans = document.getElementById("remotetrans");
const mute_btn = document.getElementById("mute");
const camera_btn = document.getElementById("camera");
const cameras_select = document.getElementById("cameras");
const call = document.getElementById("call");
call.hidden = true;

let my_stream;
let image_capture;
let muted = false;
let camera_off = false;
let room_name;

const peer_connection_object_Array = [];

async function getCameras() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    cameras = devices.filter((device) => device.kind === "videoinput");
    const current_camera = my_stream.getVideoTracks()[0];
    cameras.forEach((camera) => {
      const option = document.createElement("option");
      option.value = camera.deviceId;
      option.innerText = camera.label;
      if (current_camera.label === camera.label) {
        option.selected = true;
      }
      cameras_select.appendChild(option);
    });
  } catch (error) {
    console.log(error);
  }
}

async function getMedia(deviceId) {
  const initial_constraints = {
    audio: true,
    video: { facingMode: "user" },
  };

  const camera_constraints = {
    audio: true,
    video: { deviceId: { exact: deviceId } },
  };
  try {
    my_stream = await navigator.mediaDevices.getUserMedia(
      deviceId ? camera_constraints : initial_constraints
    );
    my_face.srcObject = my_stream;
    if (!deviceId) {
      await getCameras();
    }
  } catch (error) {
    console.log(error);
  }
}

// Control

take_photo_btn.addEventListener("click", handleTakePhoto);
mute_btn.addEventListener("click", handleMuteClick);
camera_btn.addEventListener("click", handleCameraClick);
cameras_select.addEventListener("input", handleCameraChange);

function handleTakePhoto() {
  takePhoto(); // 자기자신
  socket.emit("take_photo", room_name); // 방에 있는 모든 사람
}

function takePhoto() {
  const photo_canvas = document.getElementById("photo");
  const context = photo_canvas.getContext("2d");
  context.drawImage(my_face, 0, 0, my_face.width, my_face.height);
  const photo_data = photo_canvas.toDataURL("image/png");
}

function handleMuteClick() {
  my_stream
    .getAudioTracks()
    .forEach((track) => (track.enabled = !track.enabled));
  if (muted) {
    mute_btn.innerText = "Mute";
    muted = false;
  } else {
    mute_btn.innerText = "Unmute";
    muted = true;
  }
}

function handleCameraClick() {
  my_stream
    .getVideoTracks()
    .forEach((track) => (track.enabled = !track.enabled));
  if (camera_off) {
    camera_btn.innerText = "Turn Camera Off";
    camera_off = false;
  } else {
    camera_btn.innerText = "Turn Camera On";
    camera_off = true;
  }
}

async function handleCameraChange() {
  await getMedia(cameras_select.value);
  if (peer_connection_object_Array.length > 0) {
    const videoTrack = my_stream.getVideoTracks()[0];
    peer_connection_object_Array.forEach((peerConnectionObj) => {
      const peerConnection = peerConnectionObj.connection;
      const videoSender = peerConnection
        .getSenders()
        .find((sender) => sender.track.kind === "video");
      videoSender.replaceTrack(videoTrack);
    });
  }
}

// Welcome form (join a room)

const welcome = document.getElementById("welcome");
const welcomeForm = welcome.querySelector("form");

welcomeForm.addEventListener("submit", handleWelcomeSubmit);

async function handleWelcomeSubmit(event) {
  event.preventDefault();
  const input = welcomeForm.querySelector("input");
  room_name = input.value;
  await initCall();
  socket.emit("join_room", room_name, socket.id);
  input.value = "";
}

async function initCall() {
  welcome.hidden = true;
  call.hidden = false;
  await getMedia();
  makeConnection();
}

// socket code

socket.on("welcome", async (remote_socket_id) => {
  console.log(`welcome ${remote_socket_id}`);
  try {
    makeConnection();
    const index = peer_connection_object_Array.length - 1;
    peer_connection_object_Array[index].remote_socket_id = remote_socket_id;
    const offer = await peer_connection_object_Array[
      index
    ].connection.createOffer();
    peer_connection_object_Array[index].connection.setLocalDescription(offer);
    socket.emit(
      "offer",
      offer,
      peer_connection_object_Array[index].local_socket_id,
      remote_socket_id,
      index
    );
  } catch (error) {
    console.log(error);
  }
});

socket.on("offer", async (offer, remote_socket_id, remote_index) => {
  // console.log(`offer ${remote_socket_id}`);
  try {
    makeConnection();
    const index = peer_connection_object_Array.length - 1;
    peer_connection_object_Array[index].remote_socket_id = remote_socket_id;
    peer_connection_object_Array[index].remote_index = remote_index;
    peer_connection_object_Array[index].connection.setRemoteDescription(offer);
    const answer = await peer_connection_object_Array[
      index
    ].connection.createAnswer();
    peer_connection_object_Array[index].connection.setLocalDescription(answer);
    socket.emit("answer", answer, remote_socket_id, index, remote_index);
  } catch (error) {
    console.log(error);
  }
});

socket.on("answer", (answer, remote_index, index) => {
  peer_connection_object_Array[index].connection.setRemoteDescription(answer);
  peer_connection_object_Array[index].remote_index = remote_index;
});

socket.on("ice", async (ice, index) => {
  if (index) {
    await peer_connection_object_Array[index].connection.addIceCandidate(ice);
  }
});

socket.on("leave_room", (remote_socket_id) => {
  // console.log(`${remote_socket_id} left the room`);
  removeVideo(remote_socket_id);
});

socket.on("take_photo", () => {
  // console.log("take photo: ", socket.id);
  takePhoto();
});

// RTC code

function makeConnection() {
  // console.log(`make connection`);
  const my_peer_connection = new RTCPeerConnection({
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
  });

  my_peer_connection.addEventListener("icecandidate", handleIce);
  my_peer_connection.addEventListener("addstream", handleAddStream);

  my_stream
    .getTracks()
    .forEach((track) => my_peer_connection.addTrack(track, my_stream));

  peer_connection_object_Array.push({
    connection: my_peer_connection,
    local_socket_id: socket.id,
  });
}

function handleIce(data) {
  peer_connection_object_Array.forEach((peer_connection_object) => {
    if (data.target === peer_connection_object.connection) {
      socket.emit(
        "ice",
        data.candidate,
        peer_connection_object.remote_socket_id,
        peer_connection_object.remote_index
      );
    }
  });
}

function handleAddStream(data) {
  // console.log(`handle add stream ${data.stream.id}`);
  const peerStream = data.stream;
  // peer array에서 커넥션 정보 찾아서 스트림 추가
  peer_connection_object_Array.forEach((peer_connection_object) => {
    if (data.target === peer_connection_object.connection) {
      paintPeerFace(peerStream, peer_connection_object.remote_socket_id);
    }
  });
}

function paintPeerFace(stream, remote_socket_id) {
  remote.srcObject = stream;
  remote.autoplay = true;
  remote.playsInline = true;
  remote.style.width = "640px";
  remote.style.height = "480px";
}

// video control
function removeVideo(target_socket_id) {
  // console.log(`>>> remove video ${target_socket_id}`);
  const streams = document.querySelector("#streams");
  const videos_div = streams.querySelectorAll("div");
  videos_div.forEach((video_div) => {
    if (video_div.id === target_socket_id) {
      // console.log(`>> find video ${target_socket_id}`);
      streams.removeChild(video_div);
    }
  });
}
