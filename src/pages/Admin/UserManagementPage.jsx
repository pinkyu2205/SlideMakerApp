import { useEffect, useState } from 'react'
import { getAllUsers } from '../../services/api'
import './UserManagementPage.css'

const UserManagementPage = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  // Tách hàm fetch data để có thể gọi lại
  const fetchUsers = () => {
    setLoading(true)
    setError('')
    getAllUsers()
      .then((response) => {
        setUsers(response.data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Lỗi lấy danh sách user', err)
        setError('Không thể tải danh sách người dùng. Bạn có phải là Admin?')
        setLoading(false)
      })
  }

  // Chỉ gọi fetchUsers khi component được tải lần đầu
  useEffect(() => {
    fetchUsers()
  }, [])

  // Hàm xử lý khi nhấn nút Xóa
  const handleDeleteUser = (userId) => {
    if (window.confirm('Bạn có chắc muốn xóa người dùng này?')) {
      deleteUser(userId)
        .then(() => {
          // Xóa thành công, tải lại danh sách
          fetchUsers()
        })
        .catch((err) => {
          console.error('Lỗi xóa user', err)
          setError('Xóa người dùng thất bại. Vui lòng thử lại.')
        })
    }
  }

  useEffect(() => {
    // Gọi API lấy danh sách user
    getAllUsers()
      .then((response) => {
        setUsers(response.data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Lỗi lấy danh sách user', err)
        setLoading(false)
      })
  }, [])

  if (loading) return <p>Đang tải danh sách người dùng...</p>

  return (
    <div className='admin-user-management'>
      <h1 className='admin-page-title'>Quản lý Người Dùng</h1>
      <div className='user-table-container'>
        <table className='user-table'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Ngày Tạo</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.userID}>
                <td>{user.userID}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge ${user.role.toLowerCase()}`}>
                    {user.role}
                  </span>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className='user-actions'>
                  <button className='action-btn edit'>Sửa</button>
                  <button className='action-btn delete'>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default UserManagementPage
