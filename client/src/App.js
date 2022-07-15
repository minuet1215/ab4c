import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingPage from "./components/views/LandingPage/LandingPage";
import LoginPage from "./components/views/LoginPage/LoginPage";
import RegisterPage from "./components/views/RegisterPage/RegisterPage";
import LobbyPage from "./components/views/LobbyPage/LobbyPage";
import VideoCallPage from "./components/views/VideoCallPage/VideoCallPage";
import Auth from "./hoc/auth";

// import TestPage from "./components/views/Test/Test";

function App() {
  const AuthLandingPage = Auth(LandingPage, null);
  const AuthLoginPage = Auth(LoginPage, false);
  const AuthRegisterPage = Auth(RegisterPage, false);
  const AuthLobbyPage = Auth(LobbyPage, true);
  const AuthVideoCallPage = Auth(VideoCallPage, true);

  return (
    <Router>
      <div>
        <Routes>
          <Route exact path="/" element={<AuthLandingPage />} />
          <Route exact path="/login" element={<AuthLoginPage />} />
          <Route exact path="/register" element={<AuthRegisterPage />} />
          <Route exact path="/lobby" element={<AuthLobbyPage />} />
          <Route
            exact
            path="/video_call/:room_name"
            element={<AuthVideoCallPage />}
          />
          {/* <Route exact path="/test" element={<TestPage />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
