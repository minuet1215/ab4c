import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* Components */
import AlbumPage from "./components/Album/Album";
import CameraPage from "./components/Camera/Camera";
import GroupPage from "./components/GroupPage/GroupPage";
import LandingPage from "./components/LandingPage/LandingPage";
import Editor from "./components/ImageEditor/ImageEditor";
import LobbyPage from "./components/LobbyPage/LobbyPage";
import LoginPage from "./components/LoginPage/LoginPage";
import PhotoEditPage from "./components/PhotoEditPage/PhotoEditPage";
import RegisterPage from "./components/RegisterPage/RegisterPage";
import UserMain from "./components/UserMain/UserMain";
import VideoCallPage from "./components/VideoCallPage/VideoCallPage";
import InfinityScroll from "./components/InfiniteScroll/InfiniteScroll";

import Auth from "./hoc/auth";
import KakaoAuth from "./controller/KakaoAuth";
import Profile from "./controller/Profile";

function App() {
  const AuthLandingPage = Auth(LandingPage, null);
  const AuthUserMain = Auth(UserMain, true);
  const AuthLoginPage = Auth(LoginPage, false);
  const AuthRegisterPage = Auth(RegisterPage, false);
  const AuthLobbyPage = Auth(LobbyPage, true);
  const AuthVideoCallPage = Auth(VideoCallPage, true);
  const KakaoAuthPage = Auth(KakaoAuth, false);
  const AuthAlbumPage = Auth(AlbumPage, true);
  const AuthEditPhotoPage = Auth(Editor, null);
  const AuthCameraPage = Auth(CameraPage, true);
  const AuthScrollPage = Auth(InfinityScroll, null);

  return (
    <Router>
      <div>
        <ToastContainer />
        <Routes>
          <Route exact path="/" element={<AuthLandingPage />} />
          <Route exact path="/main" element={<AuthUserMain />} />
          <Route exact path="/login" element={<AuthLoginPage />} />
          <Route exact path="/register" element={<AuthRegisterPage />} />
          <Route exact path="/lobby" element={<AuthLobbyPage />} />
          <Route exact path="/album" element={<AuthAlbumPage />} />
          <Route exact path="/editPhoto" element={<AuthEditPhotoPage />} />
          <Route exact path="/group/:roomname" element={<GroupPage />} />
          <Route exact path="/camera" element={<AuthCameraPage />} />
          <Route exact path="scroll" element={<AuthScrollPage/>}/>
          <Route
            exact
            path="/video_call/:room_name"
            element={<AuthVideoCallPage />}
          />

          <Route
            exact
            path="/oauth/kakao/callback"
            element={<KakaoAuthPage />}
          />

          {/* <KakaoAuth/> */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit" element={<PhotoEditPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
