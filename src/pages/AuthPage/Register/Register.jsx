import { Users } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { register } from '../../../services/api'
import './Register.css'

const Register = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Teacher',
  })
  const [error, setError] = useState('')

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu không khớp!')
      return
    }

    try {
      const response = await register(formData)
      console.log('Register successful:', response.data)
      alert('Đăng ký thành công!')
      navigate('/login') // Chuyển đến trang đăng nhập sau khi đăng ký thành công
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.'
      setError(errorMessage)
      console.error('Register error:', err)
    }
  }

  return (
    <div className='register-page'>
      <div className='register-container'>
        <div className='register-card'>
          <div className='register-header'>
            <div className='register-icon-wrapper'>
              <div>
                <Users className='register-icon' />
              </div>
            </div>
            <h2 className='register-title'>Đăng ký</h2>
            <p className='register-subtitle'>Tạo tài khoản mới để bắt đầu</p>
          </div>

          <form className='register-form' onSubmit={handleRegister}>
            <div className='form-group'>
              <label className='form-label'>Tên người dùng</label>
              <input
                type='text'
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className='form-input'
                placeholder='Nhập tên người dùng'
              />
            </div>

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
              <label className='form-label'>Vai trò</label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className='form-select'
              >
                <option value='Teacher'>Giáo viên</option>
                <option value='Student'>Học sinh</option>
              </select>
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

            <div className='form-group'>
              <label className='form-label'>Xác nhận mật khẩu</label>
              <input
                type='password'
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className='form-input'
                placeholder='••••••••'
              />
            </div>
            {error && (
              <p
                className='error-message'
                style={{ color: 'red', textAlign: 'center' }}
              >
                {error}
              </p>
            )}
            <button type='submit' className='register-button'>
              Đăng ký
            </button>
          </form>

          <div className='register-footer'>
            <p className='footer-text'>
              Đã có tài khoản?{' '}
              <button
                onClick={() => navigate('/login')}
                className='footer-link'
              >
                Đăng nhập
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
