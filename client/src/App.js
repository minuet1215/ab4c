import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* Components */
import AlbumPage from "./components/Album/Album";
import GroupPage from "./components/GroupPage/GroupPage";
import LandingPage from "./components/LandingPage/LandingPage";
import Editor from "./components/ImageEditor/ImageEditor";
import LoginPage from "./components/LoginPage/LoginPage";
import PhotoEditPage from "./components/PhotoEditPage/PhotoEditPage";
import RegisterPage from "./components/RegisterPage/RegisterPage";
import UserMain from "./components/UserMain/UserMain";
import AllAlbumPage from "./components/AllAlbum/AllAlbum";

import Auth from "./hoc/auth";
import KakaoAuth from "./controller/KakaoAuth";
import Profile from "./controller/Profile";

function App() {
  const AuthLandingPage = Auth(LandingPage, null);
  const AuthUserMain = Auth(UserMain, true);
  const AuthLoginPage = Auth(LoginPage, false);
  const AuthRegisterPage = Auth(RegisterPage, false);
  const KakaoAuthPage = Auth(KakaoAuth, false);
  const AuthAlbumPage = Auth(AlbumPage, true);
  const AuthEditPhotoPage = Auth(Editor, null);
  const AuthAllAlbumPage = Auth(AllAlbumPage, true);

  return (
    <Router>
      <div className="size_fix_box">
        <ToastContainer position="top-center" autoClose={2000} limit={1} />
        <Routes>
          <Route exact path="/" element={<AuthLandingPage />} />
          <Route exact path="/main" element={<AuthUserMain />} />
          <Route exact path="/login" element={<AuthLoginPage />} />
          <Route exact path="/register" element={<AuthRegisterPage />} />
          <Route exact path="/album" element={<AuthAlbumPage />} />
          <Route exact path="/editPhoto" element={<AuthEditPhotoPage />} />
          <Route exact path="/group/:roomname" element={<GroupPage />} />
          <Route exact path="allalbum" element={<AuthAllAlbumPage />} />
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
