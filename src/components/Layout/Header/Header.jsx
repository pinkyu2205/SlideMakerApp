import { BookOpen, Menu, X, LogOut, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

const Header = ({ currentPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Load user data from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        console.log("🔍 User from localStorage:", userData);
        setUser(userData);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    console.log("🚪 Logging out...");
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
    setIsMenuOpen(false);
  };

  // Check if user is admin (roleID === 1 or roleId === 1 or role === 'Admin')
  const isAdmin = user && (
    user.roleID === 1 || 
    user.roleId === 1 || 
    user.role === 'Admin' || 
    user.role === 'admin'
  )
  
  console.log('🔍 Header - User:', user)
  console.log('🔍 Header - Is Admin:', isAdmin)
  console.log('🔍 Header - User roleID:', user?.roleID)
  console.log('🔍 Header - User roleId:', user?.roleId)
  console.log('🔍 Header - User role:', user?.role)

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
              to="/curriculum"
              className={`nav-link ${
                currentPage === "/curriculum" ? "active" : ""
              }`}
            >
              GDPT
            </Link>
            {isAdmin && (
              <Link
                to="/import"
                className={`nav-link ${
                  currentPage === "/import" ? "active" : ""
                }`}
              >
                📝 Đăng bài
              </Link>
            )}
            <Link
              to="/templates"
              className={`nav-link ${
                currentPage === "/templates" ? "active" : ""
              }`}
            >
              Thư viện Template
            </Link>
            <button className="nav-link">Về chúng tôi</button>
            <button className="nav-link">Hướng dẫn</button>

            {user ? (
              <div className="user-menu-wrapper">
                <button
                  className="user-menu-button"
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                >
                  <span className="user-menu-name">
                    {user.fullName || user.username || user.email || user.name || 'User'}
                  </span>
                  <ChevronDown size={18} className={`dropdown-icon ${isUserDropdownOpen ? 'open' : ''}`} />
                </button>

                {isUserDropdownOpen && (
                  <div className="user-dropdown-menu">
                    <div className="dropdown-header">
                      <div className="dropdown-user-info">
                        <p className="dropdown-name">
                          {user.fullName || user.username || user.email || user.name}
                        </p>
                        <p className="dropdown-role">
                          {user.role || user.roleType || 'User'}
                        </p>
                      </div>
                    </div>
                    <div className="dropdown-divider" />
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        navigate('/dashboard');
                        setIsUserDropdownOpen(false);
                      }}
                    >
                      Trang cá nhân
                    </button>
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        navigate('/dashboard');
                        setIsUserDropdownOpen(false);
                      }}
                    >
                      Cài đặt
                    </button>
                    <div className="dropdown-divider" />
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsUserDropdownOpen(false);
                      }}
                      className="dropdown-item logout-item"
                    >
                      <LogOut size={16} />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
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
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="nav-mobile-link"
            >
              Trang chủ
            </Link>
            <Link
              to="/curriculum"
              onClick={() => setIsMenuOpen(false)}
              className="nav-mobile-link"
            >
              GDPT
            </Link>
            {isAdmin && (
              <Link
                to="/import"
                onClick={() => setIsMenuOpen(false)}
                className="nav-mobile-link"
              >
                📝 Đăng bài
              </Link>
            )}
            <Link
              to="/templates"
              onClick={() => setIsMenuOpen(false)}
              className="nav-mobile-link"
            >
              Thư viện Template
            </Link>
            <button className="nav-mobile-link">Về chúng tôi</button>
            <button className="nav-mobile-link">Hướng dẫn</button>
            {user ? (
              <>
                <div className="user-info-mobile">
                  <span className="user-name-mobile">
                    {user.fullName || user.username || user.email || user.name || 'User'}
                  </span>
                  <span className="user-role-mobile">{user.role || user.roleType || 'User'}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="nav-mobile-link-logout"
                >
                  <LogOut size={18} />
                  Đăng xuất
                </button>
              </>
            ) : (
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
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
