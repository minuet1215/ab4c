import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import 'bootstrap/dist/css/bootstrap.min.css';

import LandingPage from "./components/views/LandingPage/LandingPage";
import userMain from "./components/views/Main/Main";
import LoginPage from "./components/views/LoginPage/LoginPage";
import RegisterPage from "./components/views/RegisterPage/RegisterPage";
import LobbyPage from "./components/views/LobbyPage/LobbyPage";
import VideoCallPage from "./components/views/VideoCallPage/VideoCallPage";
import Main from "./components/views/testImage/image";
import Auth from "./hoc/auth";
import KakaoAuth from "./controller/KakaoAuth";
import Profile from "./controller/Profile";
import invitePage from "./components/views/invitePage/invitePage";
import AlbumPage from "./components/views/Album/Album";
import EditPhoto from "./components/views/Canvas/EditPhoto";
// import TestPage from "./components/views/Test/Test";

function App() {
  const AuthLandingPage = Auth(LandingPage, null);
  const AuthMain = Auth(userMain, true);
  const AuthLoginPage = Auth(LoginPage, false);
  const AuthRegisterPage = Auth(RegisterPage, false);
  const AuthLobbyPage = Auth(LobbyPage, true);
  const AuthVideoCallPage = Auth(VideoCallPage, true);
  const KakaoAuthPage = Auth(KakaoAuth, false);
  const AuthInvitePage = Auth(invitePage, null);
  const AuthAlbumPage = Auth(AlbumPage, true);
  const AuthEditPhotoPage = Auth(EditPhoto, null);

  return (
    <Router>
      <div>
        <Routes>
          <Route exact path="/" element={<AuthLandingPage />} />
          <Route exact path="/main" element={<AuthMain />} />
          <Route exact path="/login" element={<AuthLoginPage />} />
          <Route exact path="/register" element={<AuthRegisterPage />} />
          <Route exact path="/lobby" element={<AuthLobbyPage />} />
          <Route exact path="/invitePage" element={<AuthInvitePage />} />
          <Route exact path="/album" element={<AuthAlbumPage />} />
          <Route exact path="/testImage" element={<Main />} />
          <Route exact path="/editPhoto" element={<AuthEditPhotoPage />} />
          <Route
            exact
            path="/video_call/:room_name"
            element={<AuthVideoCallPage />}
          />
          {/* <Route exact path="/test" element={<TestPage />} /> */}
          <Route
            exact
            path="/oauth/kakao/callback"
            element={<KakaoAuthPage />}
          />
          {/* <KakaoAuth/> */}
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
