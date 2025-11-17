import { BookOpen } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom' 
import { login } from '../../../services/api' // Import hàm login
import './Login.css'

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  })
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    try {
      // Cố gắng login với email hoặc username
      const loginPayload = {
        email: formData.email,
        password: formData.password,
      })
      console.log('Login successful:', response.data)
      // Lưu token vào localStorage hoặc context
      localStorage.setItem('authToken', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      navigate('/') // Chuyển đến trang dashboard sau khi đăng nhập
    } catch (err) {
      // Cập nhật xử lý lỗi để hiển thị Network Error
      let errorMessage = 'Đăng nhập thất bại. Vui lòng thử lại.'
      if (err.code === 'ERR_NETWORK') {
        errorMessage = 'Lỗi mạng hoặc không thể kết nối đến máy chủ.'
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message
      }

      setError(errorMessage)
      console.error('Login error:', err)
    }
  }

  return (
    <div className='login-page'>
      <div className='login-container'>
        <div className='login-card'>
          <div className='login-header'>
            <div className='login-icon-wrapper'>
              <div>
                <BookOpen className='login-icon' />
              </div>
            </div>
            <h2 className='login-title'>Đăng nhập</h2>
            <p className='login-subtitle'>Chào mừng bạn quay trở lại!</p>
          </div>

          <div className='login-form'>
            <div className='form-group'>
              <label className='form-label'>Email</label>
              <input
                type='text'
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className='form-input'
                placeholder='Nhập email'
              />
            </div>

            <div className='form-group'>
              <label className='form-label'>Mật khẩu</label>
              <input
                type='password'
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className='form-input'
                placeholder='••••••••'
              />
            </div>
            {error && (
              <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>
            )}

            <div className='form-options'>
              {/* <label className='checkbox-label'>
                <input
                  type='checkbox'
                  checked={formData.remember}
                  onChange={(e) =>
                    setFormData({ ...formData, remember: e.target.checked })
                  }
                  className='checkbox-input'
                />
                <span className='checkbox-text'>Ghi nhớ đăng nhập</span>
              </label> */}
              <Link to="/forgot-password" className='forgot-password' style={{textDecoration: 'none'}}>
    Quên mật khẩu?
</Link>
            </div>

            <button onClick={handleLogin} className='login-button'>
              Đăng nhập
            </button>
          </div>

          <div className='login-footer'>
            <p className='footer-text'>
              Chưa có tài khoản?{' '}
              <button
                onClick={() => navigate('/register')}
                className='footer-link'
              >
                Đăng ký ngay
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
