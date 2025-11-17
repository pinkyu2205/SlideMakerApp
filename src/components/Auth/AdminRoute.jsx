import { Navigate, Outlet } from 'react-router-dom'

const AdminRoute = () => {
  // Lấy thông tin user từ localStorage
  const userString = localStorage.getItem('user')

  let user = null
  if (userString) {
    try {
      user = JSON.parse(userString)
    } catch (e) {
      console.error('Lỗi parse JSON từ localStorage', e)
      // Nếu JSON lỗi, coi như chưa đăng nhập
    }
  }

  // 1. Kiểm tra đã đăng nhập và có phải Admin không
  if (user && user.role === 'Admin') {
    // Nếu là Admin, cho phép truy cập các route con (Outlet)
    return <Outlet />
  }

  // 2. Nếu đã đăng nhập nhưng không phải Admin (VD: Student, Teacher)
  if (user) {
    // Trả về trang chủ (HomePage) như bạn yêu cầu
    return <Navigate to='/' replace />
  }

  // 3. Nếu chưa đăng nhập (không có user)
  // Trả về trang đăng nhập
  return <Navigate to='/login' replace />
}

export default AdminRoute
