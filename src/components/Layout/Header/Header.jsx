import { BookOpen, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

const Header = ({ currentPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="header">
      <nav className="header-container">
        <div className="header-content">
          <Link to="/" className="header-logo">
            <BookOpen className="logo-icon" />
            <span className="logo-text">MathSlides</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="nav-desktop">
            <Link
              to="/"
              className={`nav-link ${currentPage === "/" ? "active" : ""}`}
            >
              Trang chủ
            </Link>
            <Link
              to="/options-template"
              className={`nav-link ${
                currentPage === "/options-template" ? "active" : ""
              }`}
            >
              Chọn Chương trình học
            </Link>
            <Link
              to="/templates"
              className={`nav-link ${
                currentPage === "/templates" ? "active" : ""
              }`}
            >
              Thư viện Template
            </Link>
            <Link
              to="/slide-generator"
              className={`nav-link ${
                currentPage === "/slide-generator" ? "active" : ""
              }`}
            >
              Tạo Slide
            </Link>
            <button className="nav-link">Về chúng tôi</button>
            <button className="nav-link">Hướng dẫn</button>
            <Link to="/login" className="nav-link">
              Đăng nhập
            </Link>
            <button
              onClick={() => navigate("/register")}
              className="btn-register"
            >
              Đăng ký
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="menu-icon" />
            ) : (
              <Menu className="menu-icon" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="nav-mobile">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="nav-mobile-link"
            >
              Trang chủ
            </Link>
            {/* THÊM LINK MỚI */}
            <Link
              to="/templates"
              onClick={() => setIsMenuOpen(false)}
              className="nav-mobile-link"
            >
              Thư viện Template
            </Link>
            <button className="nav-mobile-link">Về chúng tôi</button>
            <button className="nav-mobile-link">Hướng dẫn</button>
            <Link
              to="/login"
              onClick={() => setIsMenuOpen(false)}
              className="nav-mobile-link"
            >
              Đăng nhập
            </Link>
            <button
              onClick={() => {
                navigate("/register");
                setIsMenuOpen(false);
              }}
              className="nav-mobile-link-register"
            >
              Đăng ký
            </button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
