import { BookOpen } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  })

  const handleLogin = (e) => {
    e.preventDefault()
    console.log('Login:', formData)
    // TODO: Implement login logic
    // navigate('/dashboard'); // Sau khi đăng nhập thành công
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
                type='email'
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className='form-input'
                placeholder='example@email.com'
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

            <div className='form-options'>
              <label className='checkbox-label'>
                <input
                  type='checkbox'
                  checked={formData.remember}
                  onChange={(e) =>
                    setFormData({ ...formData, remember: e.target.checked })
                  }
                  className='checkbox-input'
                />
                <span className='checkbox-text'>Ghi nhớ đăng nhập</span>
              </label>
              <button className='forgot-password'>Quên mật khẩu?</button>
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
