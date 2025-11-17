import { LockKeyhole } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { resetPassword } from '../../../services/api';
import '../Login/Login.css'; // Tái sử dụng CSS

const ResetPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    token: '',
    newPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await resetPassword(formData);
      setMessage({ type: 'success', text: 'Đổi mật khẩu thành công! Đang chuyển hướng...' });
      
      // Chuyển hướng về trang login sau 2 giây
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || 'Đổi mật khẩu thất bại. Vui lòng kiểm tra lại thông tin.';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='login-page'>
      <div className='login-container'>
        <div className='login-card'>
          <div className='login-header'>
            <div className='login-icon-wrapper'>
              <div>
                <LockKeyhole className='login-icon' />
              </div>
            </div>
            <h2 className='login-title'>Đặt lại mật khẩu</h2>
            <p className='login-subtitle'>Nhập mã xác nhận bạn nhận được qua email.</p>
          </div>

          {message.text && (
            <div className={`message-box ${message.type === 'success' ? 'success' : 'error'}`} 
                 style={{ 
                   textAlign: 'center', 
                   marginBottom: '1rem', 
                   color: message.type === 'success' ? '#047857' : '#b91c1c',
                   backgroundColor: message.type === 'success' ? '#ecfdf5' : '#fef2f2',
                   padding: '0.75rem',
                   borderRadius: '0.5rem'
                 }}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className='login-form'>
            <div className='form-group'>
              <label className='form-label'>Email</label>
              <input
                type='email'
                name="email"
                value={formData.email}
                onChange={handleChange}
                className='form-input'
                placeholder='name@example.com'
                required
              />
            </div>

            <div className='form-group'>
              <label className='form-label'>Mã xác nhận (Token)</label>
              <input
                type='text'
                name="token"
                value={formData.token}
                onChange={handleChange}
                className='form-input'
                placeholder='Nhập mã token...'
                required
              />
            </div>

            <div className='form-group'>
              <label className='form-label'>Mật khẩu mới</label>
              <input
                type='password'
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className='form-input'
                placeholder='••••••••'
                minLength={6}
                required
              />
            </div>

            <button type='submit' className='login-button' disabled={loading}>
              {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
            </button>
          </form>

          <div className='login-footer'>
            <Link to="/login" className='footer-link'>
              Quay lại Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;