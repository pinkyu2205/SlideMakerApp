import { User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { getUserProfile, updateUserProfile } from '../../services/api';
import './ProfilePage.css';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    newPassword: '', // Optional
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Lấy thông tin user khi vào trang
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await getUserProfile();
      const userData = response.data;
      setUser(userData);
      setFormData({
        username: userData.username,
        email: userData.email,
        newPassword: '',
      });
    } catch (error) {
      console.error("Lỗi tải profile:", error);
      setMessage({ type: 'error', text: 'Không thể tải thông tin hồ sơ.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      // 1. Xử lý dữ liệu trước khi gửi
      const dataToSend = { ...formData };
      
      // Nếu mật khẩu rỗng, gán thành null để Backend không validate độ dài
      if (!dataToSend.newPassword) {
        dataToSend.newPassword = null; 
      }

      // 2. Gọi API cập nhật
      const response = await updateUserProfile(user.userID, dataToSend);
      
      // 3. Cập nhật localStorage (Trộn thông tin cũ với thông tin mới từ server)
      const currentUser = JSON.parse(localStorage.getItem('user'));
      // response.data trả về UserInfo mới (bao gồm username mới)
      const updatedUser = { ...currentUser, ...response.data }; 
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // --- QUAN TRỌNG: Bắn sự kiện để Header cập nhật lại tên ---
      window.dispatchEvent(new Event("userUpdated"));
      // ----------------------------------------------------------
      
      // 4. Cập nhật state nội bộ
      setUser(response.data);
      setFormData(prev => ({ ...prev, newPassword: '' })); // Xóa trường mật khẩu
      
      setMessage({ type: 'success', text: 'Cập nhật hồ sơ thành công!' });
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      const msg = error.response?.data?.message || "Cập nhật thất bại. Vui lòng thử lại.";
      setMessage({ type: 'error', text: msg });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="profile-page">Đang tải...</div>;

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar-wrapper">
            <User className="profile-avatar-icon" />
          </div>
          <h2 className="profile-title">Hồ sơ cá nhân</h2>
          <p className="profile-role">{user?.role}</p>
        </div>

        {message.text && (
          <div className={`message-box ${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label className="form-label">Tên đăng nhập</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mật khẩu mới (Bỏ trống nếu không đổi)</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="form-input"
              placeholder="Nhập mật khẩu mới..."
            />
          </div>

          <div className="profile-actions">
            <button type="submit" className="btn-save" disabled={saving}>
              {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;