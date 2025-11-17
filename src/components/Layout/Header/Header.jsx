import { BookOpen, ChevronDown, LogOut, Menu, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

const Header = ({ currentPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Logic kiểm tra user mỗi khi chuyển trang (currentPage thay đổi)
  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      try {
        const userData = JSON.parse(userString);
        setUser(userData);
      } catch (error) {
        console.error("Lỗi parse user data", error);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [currentPage]); // Chạy lại khi route thay đổi

  const handleLogout = () => {
    // 1. Xóa thông tin trong localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    
    // 2. Reset state
    setUser(null);
    setIsUserDropdownOpen(false);
    setIsMenuOpen(false);

    // 3. Chuyển hướng về trang login hoặc trang chủ
    navigate("/login");
  };

  // Toggle dropdown menu của user
  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

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
              Chọn Template
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
            
            {/* LOGIC HIỂN THỊ USER HOẶC NÚT ĐĂNG NHẬP */}
            {user ? (
              <div className="user-profile-container">
                <div 
                  className="user-profile-trigger" 
                  onClick={toggleUserDropdown}
                >
                  {/* Hiển thị Avatar (nếu không có thì dùng icon mặc định) */}
                  <div className="user-avatar">
                    {user.avatar ? (
                      <img src={user.avatar} alt="User Avatar" />
                    ) : (
                      <User className="default-avatar-icon" />
                    )}
                  </div>
                  <span className="user-name">{user.username || user.email}</span>
                  <ChevronDown size={16} />
                </div>

                {/* User Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div className="user-dropdown">
                    <div className="dropdown-header">
                      <span className="dropdown-role">{user.role || "User"}</span>
                    </div>
                    <Link to="/profile" className="dropdown-item">
                      <User size={16} /> Hồ sơ cá nhân
                    </Link>
                    {/* Nếu là Admin thì hiện link Dashboard */}
                    {user.role === 'Admin' && (
                         <Link to="/admin/dashboard" className="dropdown-item">
                         <BookOpen size={16} /> Quản trị
                       </Link>
                    )}
                    <div className="dropdown-divider"></div>
                    <button onClick={handleLogout} className="dropdown-item logout">
                      <LogOut size={16} /> Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Nếu chưa đăng nhập thì hiện nút cũ
              <>
                <Link to="/login" className="nav-link">
                  Đăng nhập
                </Link>
                <button
                  onClick={() => navigate("/register")}
                  className="btn-register"
                >
                  Đăng ký
                </button>
              </>
            )}
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
            {/* Nếu đã đăng nhập, hiện thông tin user trên mobile */}
            {user && (
              <div className="mobile-user-info">
                <div className="mobile-user-header">
                   <div className="user-avatar mobile">
                    {user.avatar ? (
                      <img src={user.avatar} alt="User Avatar" />
                    ) : (
                      <User className="default-avatar-icon" />
                    )}
                  </div>
                  <div className="mobile-user-details">
                    <span className="mobile-user-name">{user.username}</span>
                    <span className="mobile-user-role">{user.role}</span>
                  </div>
                </div>
              </div>
            )}

            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="nav-mobile-link"
            >
              Trang chủ
            </Link>
            <Link
              to="/templates"
              onClick={() => setIsMenuOpen(false)}
              className="nav-mobile-link"
            >
              Thư viện Template
            </Link>
            
            {/* Nếu chưa đăng nhập thì hiện Link đăng nhập/đăng ký */}
            {!user ? (
              <>
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
              </>
            ) : (
              // Nếu đã đăng nhập thì hiện nút Đăng xuất
              <button 
                onClick={handleLogout}
                className="nav-mobile-link mobile-logout"
              >
                <LogOut size={16} style={{marginRight: '8px'}}/> Đăng xuất
              </button>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;