import { Save, X } from 'lucide-react' // Icon cho đẹp (nếu đã cài lucide-react)
import { useEffect, useState } from 'react'
import { getAllUsers, updateUser } from '../../services/api'
import './UserManagementPage.css'

const UserManagementPage = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // State cho Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)

  // Mapping Role (Dựa trên data mẫu bạn gửi)
  const ROLE_MAPPING = {
    1: 'Admin',
    2: 'Teacher',
    3: 'Student',
  }

  // Hàm hỗ trợ lấy ID từ tên (dùng khi admin chọn role trên UI)
  const getRoleIdByName = (name) => {
    return (
      Object.keys(ROLE_MAPPING).find((key) => ROLE_MAPPING[key] === name) || 3
    )
  }

  // 1. Lấy danh sách User
  const fetchUsers = () => {
    setLoading(true)
    getAllUsers()
      .then((response) => {
        console.log('Users Data:', response.data)
        setUsers(response.data)
      })
      .catch((err) => {
        console.error(err)
        setError('Không thể tải danh sách người dùng.')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // 2. Mở Modal và điền dữ liệu cũ
  const handleEditClick = (user) => {
    setEditingUser({
      userID: user.userID,
      username: user.username,
      email: user.email,
      roleID: user.roleID, // Lưu ý dùng roleID để gửi lên server
      isActive: user.isActive,
    })
    setIsModalOpen(true)
  }

  // 3. Xử lý thay đổi trong form Modal
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setEditingUser((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  // 4. Gửi API Cập nhật (Save)
  const handleSaveUser = () => {
    if (!editingUser) return

    // Cấu trúc body theo đúng yêu cầu Swagger
    const payload = {
      username: editingUser.username,
      email: editingUser.email,
      roleID: parseInt(editingUser.roleID), // Đảm bảo là số nguyên
      isActive: editingUser.isActive,
    }

    updateUser(editingUser.userID, payload)
      .then(() => {
        alert('Cập nhật thành công!')
        setIsModalOpen(false)
        fetchUsers() // Refresh lại bảng
      })
      .catch((err) => {
        console.error(err)
        alert(
          'Cập nhật thất bại: ' + (err.response?.data?.message || err.message)
        )
      })
  }

  // 5. Xử lý "Xóa mềm" (Chuyển isActive thành false)
  const handleSoftDelete = (user) => {
    if (
      window.confirm(`Bạn có chắc muốn vô hiệu hóa tài khoản ${user.username}?`)
    ) {
      const payload = {
        username: user.username,
        email: user.email,
        roleID: user.roleID,
        isActive: false, // CHỈ THAY ĐỔI TRẠNG THÁI NÀY
      }

      updateUser(user.userID, payload)
        .then(() => {
          // alert('Đã vô hiệu hóa người dùng.')
          fetchUsers()
        })
        .catch((err) => {
          console.error(err)
          alert('Lỗi khi xóa người dùng.')
        })
    }
  }

  if (loading) return <div className='loading-text'>Đang tải dữ liệu...</div>

  return (
    <div className='admin-user-management'>
      <h1 className='admin-page-title'>Quản lý Người Dùng</h1>

      {error && <p className='admin-error-message'>{error}</p>}

      {/* BẢNG HIỂN THỊ */}
      <div className='user-table-container'>
        <table className='user-table'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Trạng thái</th>
              <th>Ngày Tạo</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.userID}
                className={!user.isActive ? 'row-inactive' : ''}
              >
                <td>{user.userID}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <span
                    className={`role-badge ${user.roleName?.toLowerCase()}`}
                  >
                    {user.roleName}
                  </span>
                </td>
                <td>
                  <span
                    className={`status-badge ${
                      user.isActive ? 'active' : 'inactive'
                    }`}
                  >
                    {user.isActive ? 'Hoạt động' : 'Đã khóa'}
                  </span>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString('vi-VN')}</td>
                <td className='user-actions'>
                  <button
                    className='action-btn edit'
                    onClick={() => handleEditClick(user)}
                  >
                    Sửa
                  </button>

                  {/* Nút xóa chỉ hiện nếu đang Active, hoặc đổi text thành "Mở khóa" nếu Inactive */}
                  {user.isActive ? (
                    <button
                      className='action-btn delete'
                      onClick={() => handleSoftDelete(user)}
                    >
                      Xóa
                    </button>
                  ) : (
                    <button
                      className='action-btn restore'
                      onClick={() => {
                        // Logic restore tương tự update isActive = true
                        updateUser(user.userID, {
                          ...user,
                          isActive: true,
                        }).then(fetchUsers)
                      }}
                    >
                      Mở lại
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL CHỈNH SỬA */}
      {isModalOpen && editingUser && (
        <div className='modal-overlay'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h2>Cập nhật người dùng: {editingUser.username}</h2>
              <button
                className='close-btn'
                onClick={() => setIsModalOpen(false)}
              >
                <X size={24} />
              </button>
            </div>

            <div className='modal-body'>
              <div className='form-group'>
                <label>Username</label>
                <input
                  type='text'
                  name='username'
                  value={editingUser.username}
                  onChange={handleInputChange}
                />
              </div>

              <div className='form-group'>
                <label>Email</label>
                <input
                  type='email'
                  name='email'
                  value={editingUser.email}
                  onChange={handleInputChange}
                />
              </div>

              <div className='form-group'>
                <label>Vai trò</label>
                <select
                  name='roleID'
                  value={editingUser.roleID}
                  onChange={handleInputChange}
                >
                  <option value={1}>Admin</option>
                  <option value={2}>Teacher</option>
                  <option value={3}>Student</option>
                </select>
              </div>

              <div className='form-group checkbox-group'>
                <label>
                  <input
                    type='checkbox'
                    name='isActive'
                    checked={editingUser.isActive}
                    onChange={handleInputChange}
                  />
                  Trạng thái hoạt động (Active)
                </label>
              </div>
            </div>

            <div className='modal-footer'>
              <button
                className='btn-cancel'
                onClick={() => setIsModalOpen(false)}
              >
                Hủy
              </button>
              <button className='btn-save' onClick={handleSaveUser}>
                <Save size={18} style={{ marginRight: '5px' }} /> Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserManagementPage
