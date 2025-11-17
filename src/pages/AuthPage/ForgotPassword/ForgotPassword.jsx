import { KeyRound } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom' // 1. Thêm useNavigate
import { forgotPassword } from '../../../services/api'
import '../Login/Login.css'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const navigate = useNavigate() // 2. Khởi tạo hook

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    try {
      const response = await forgotPassword(email)
      setMessage(
        response.data.message || 'Nếu email tồn tại, mã khôi phục đã được gửi.'
      )
    } catch (err) {
      console.error(err)
      setError('Đã có lỗi xảy ra hoặc không thể kết nối đến server.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='login-page'>
      <div className='login-container'>
        <div className='login-card'>
          <div className='login-header'>
            <div className='login-icon-wrapper'>
              <div>
                <KeyRound className='login-icon' />
              </div>
            </div>
            <h2 className='login-title'>Quên mật khẩu?</h2>
            <p className='login-subtitle'>
              Nhập email để nhận hướng dẫn khôi phục.
            </p>
          </div>

          {message ? (
            // --- 3. CẬP NHẬT GIAO DIỆN KHI THÀNH CÔNG ---
            <div className='success-content' style={{ textAlign: 'center' }}>
              <div
                className='message-box success'
                style={{
                  textAlign: 'center',
                  marginBottom: '1.5rem',
                  color: '#047857',
                  backgroundColor: '#ecfdf5',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #a7f3d0',
                }}
              >
                {message}
              </div>

              <p style={{ marginBottom: '1rem', color: '#374151' }}>
                Đã nhận được mã? Hãy nhập mã để đặt lại mật khẩu.
              </p>

              {/* Nút chuyển sang trang Reset Password */}
              <button
                onClick={() => navigate('/reset-password')}
                className='login-button'
              >
                Nhập mã xác nhận ngay
              </button>
            </div>
          ) : (
            // ---------------------------------------------
            <form onSubmit={handleSubmit} className='login-form'>
              <div className='form-group'>
                <label className='form-label'>Email đăng ký</label>
                <input
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='form-input'
                  placeholder='name@example.com'
                  required
                />
              </div>

              {error && (
                <p
                  style={{
                    color: 'red',
                    textAlign: 'center',
                    fontSize: '0.875rem',
                  }}
                >
                  {error}
                </p>
              )}

              <button type='submit' className='login-button' disabled={loading}>
                {loading ? 'Đang gửi...' : 'Gửi yêu cầu'}
              </button>
            </form>
          )}

          <div className='login-footer'>
            <Link to='/login' className='footer-link'>
              Quay lại Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
