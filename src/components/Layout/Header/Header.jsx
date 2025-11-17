import { BookOpen, ChevronDown, LogOut, Menu, User, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Header.css'

const Header = ({ currentPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const navigate = useNavigate()

  // Hàm helper: Đọc thông tin user từ localStorage
  const loadUserFromStorage = () => {
    const userString = localStorage.getItem('user')
    if (userString) {
      try {
        const userData = JSON.parse(userString)
        setUser(userData)
      } catch (error) {
        console.error('Lỗi parse user data', error)
        setUser(null)
      }
    } else {
      setUser(null)
    }
  }

  // Effect: Theo dõi thay đổi user
  useEffect(() => {
    loadUserFromStorage()

    const handleUserUpdate = () => {
      loadUserFromStorage()
    }
    window.addEventListener('userUpdated', handleUserUpdate)

    return () => {
      window.removeEventListener('userUpdated', handleUserUpdate)
    }
  }, [currentPage])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('authToken')
    setUser(null)
    setIsUserDropdownOpen(false)
    setIsMenuOpen(false)
    navigate('/login')
  }

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen)
  }

  const displayName = user?.username || user?.email
  
  // [SỬA LỖI] Định nghĩa isAdmin
  const isAdmin = user?.role === 'Admin' || user?.roleName === 'Admin' || user?.roleID === 1

  return (
    <header className='header'>
      <nav className='header-container'>
        <div className='header-content'>
          <Link to='/' className='header-logo'>
            <BookOpen className='logo-icon' />
            <span className='logo-text'>MathSlides</span>
          </Link>

          <div className='nav-desktop'>
            <Link
              to='/'
              className={`nav-link ${currentPage === '/' ? 'active' : ''}`}
            >
              Trang chủ
            </Link>
            {/* Link tới trang chọn chương trình học (OptionsTemplatePage) */}
            <Link
              to='/options-template'
              className={`nav-link ${
                currentPage === '/options-template' ? 'active' : ''
              }`}
            >
              Chương trình học
            </Link>
            
            {/* Chỉ Admin mới thấy link này */}
            {isAdmin && (
              <Link
                to='/admin/dashboard'
                className={`nav-link ${
                  currentPage.startsWith('/admin') ? 'active' : ''
                }`}
              >
                🛠️ Quản trị
              </Link>
            )}
            
            <Link
              to='/templates'
              className={`nav-link ${
                currentPage === '/templates' ? 'active' : ''
              }`}
            >
              Thư viện Template
            </Link>
            <Link
              to='/slide-generator'
              className={`nav-link ${
                currentPage === '/slide-generator' ? 'active' : ''
              }`}
            >
              Tạo Slide
            </Link>

            {user ? (
              <div className='user-profile-container'>
                <div
                  className='user-profile-trigger'
                  onClick={toggleUserDropdown}
                >
                  <div className='user-avatar'>
                    {user.avatar ? (
                      <img src={user.avatar} alt='User Avatar' />
                    ) : (
                      <User className='default-avatar-icon' />
                    )}
                  </div>
                  <span className='user-name' title={displayName}>
                    {displayName}
                  </span>
                  <ChevronDown size={16} />
                </div>

                {isUserDropdownOpen && (
                  <div className='user-dropdown'>
                    <div className='dropdown-header'>
                      <span className='dropdown-role'>
                        {user.role || user.roleName || 'User'}
                      </span>
                    </div>

                    <Link
                      to='/profile'
                      className='dropdown-item'
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      <User size={16} /> Hồ sơ cá nhân
                    </Link>
                    
                    <div className='dropdown-divider'></div>

                    <button
                      onClick={handleLogout}
                      className='dropdown-item logout'
                    >
                      <LogOut size={16} /> Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to='/login' className='nav-link'>
                  Đăng nhập
                </Link>
                <button
                  onClick={() => navigate('/register')}
                  className='btn-register'
                >
                  Đăng ký
                </button>
              </>
            )}
          </div>

          <button
            className='menu-toggle'
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className='menu-icon' />
            ) : (
              <Menu className='menu-icon' />
            )}
          </button>
        </div>
        
        {/* Mobile menu implementation... (giữ nguyên nếu bạn đã có) */}
      </nav>
    </header>
  )
}

export default Header