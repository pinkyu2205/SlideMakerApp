import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Footer from "./components/Layout/Footer/Footer";
import Header from "./components/Layout/Header/Header";
import Login from "./pages/AuthPage/Login/Login";
import Register from "./pages/AuthPage/Register/Register";
import DashboardPage from "./pages/DashboardPage/DashboardPage";
import HomePage from "./pages/HomePage/HomePage";
import TemplateLibraryPage from "./pages/TemplateLibraryPage/TemplateLibraryPage";
import OptionsTemplatePage from "./pages/OptionsTemplatePage/OptionsTemplatePage";
import SlideGeneratorPage from "./pages/SlideGeneratorPage/SlideGenerator";

export default function App() {
  const location = useLocation();
  const currentPage = location.pathname;
  const showFooter = currentPage === "/";

  return (
    <div className="app-container">
      <Header currentPage={currentPage} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/templates" element={<TemplateLibraryPage />} />
          <Route path="/options-template" element={<OptionsTemplatePage />} />
          <Route path="/slide-generator" element={<SlideGeneratorPage />} />
        </Routes>
      </main>
      {showFooter && <Footer />}
    </div>
  );
}
