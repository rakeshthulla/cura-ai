import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ExplorePage from "./ExplorePage";
import ChatPage from "./ChatPage";
import LoginPage from "./LoginPage";
import OverviewPage from "./OverviewPage";
import QuickStartPage from "./QuickStartPage";
import SupportPage from "./SupportPage";
import SignupPage from './SignupPage';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ExplorePage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/overview" element={<OverviewPage />} />
        <Route path="/quickstart" element={<QuickStartPage />} />
        <Route path="/support" element={<SupportPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
