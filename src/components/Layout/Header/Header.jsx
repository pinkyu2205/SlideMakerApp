import { BookOpen, ChevronDown, LogOut, Menu, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

const Header = ({ currentPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Hàm helper: Đọc thông tin user từ localStorage
  const loadUserFromStorage = () => {
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
  };

  // Effect: Theo dõi thay đổi user
  useEffect(() => {
    // 1. Load lần đầu khi component mount hoặc đổi trang
    loadUserFromStorage();

    // 2. Lắng nghe sự kiện custom "userUpdated" (từ ProfilePage bắn ra)
    const handleUserUpdate = () => {
      loadUserFromStorage();
    };
    window.addEventListener("userUpdated", handleUserUpdate);

    // 3. Cleanup listener khi component unmount
    return () => {
      window.removeEventListener("userUpdated", handleUserUpdate);
    };
  }, [currentPage]); 

  // Hàm đăng xuất
  const handleLogout = () => {
    // 1. Xóa thông tin trong localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    
    // 2. Reset state
    setUser(null);
    setIsUserDropdownOpen(false);
    setIsMenuOpen(false);

    // 3. Chuyển hướng về trang login
    navigate("/login");
  };

  // Toggle dropdown menu của user
  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  // Logic hiển thị tên: Ưu tiên username, fallback về email
  const displayName = user?.username || user?.email;

  return (
    <header className="header">
      <nav className="header-container">
        <div className="header-content">
          {/* Logo */}
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
            
            {/* LOGIC HIỂN THỊ USER PROFILE */}
            {user ? (
              <div className="user-profile-container">
                <div 
                  className="user-profile-trigger" 
                  onClick={toggleUserDropdown}
                >
                  {/* Avatar */}
                  <div className="user-avatar">
                    {user.avatar ? (
                      <img src={user.avatar} alt="User Avatar" />
                    ) : (
                      <User className="default-avatar-icon" />
                    )}
                  </div>
                  
                  {/* Tên hiển thị (đã xử lý logic ưu tiên username) */}
                  <span className="user-name" title={displayName}>
                    {displayName}
                  </span>
                  
                  <ChevronDown size={16} />
                </div>

                {/* Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div className="user-dropdown">
                    <div className="dropdown-header">
                      <span className="dropdown-role">{user.role || "User"}</span>
                    </div>
                    
                    <Link to="/profile" className="dropdown-item" onClick={() => setIsUserDropdownOpen(false)}>
                      <User size={16} /> Hồ sơ cá nhân
                    </Link>
                    
                    {/* Link Dashboard cho Admin */}
                    {user.role === 'Admin' && (
                         <Link to="/admin/dashboard" className="dropdown-item" onClick={() => setIsUserDropdownOpen(false)}>
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
              // Nếu chưa đăng nhập: Nút Login/Register
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

          {/* Mobile Menu Toggle Button */}
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

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="nav-mobile">
            {/* Thông tin User trên Mobile */}
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
                    <span className="mobile-user-name">{displayName}</span>
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
            
            {/* Link cho Mobile khi chưa đăng nhập */}
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
              // Link Logout cho Mobile
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