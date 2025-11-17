import { NavLink, Outlet } from 'react-router-dom'
import './AdminLayout.css'

const AdminLayout = () => {
  return (
    <div className='admin-layout'>
      <nav className='admin-sidebar'>
        <h2 className='admin-sidebar-title'>Admin Panel</h2>
        <ul className='admin-nav-list'>
          <li>
            <NavLink
              to='/admin/dashboard'
              className={({ isActive }) =>
                isActive ? 'admin-nav-link active' : 'admin-nav-link'
              }
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to='/admin/users'
              className={({ isActive }) =>
                isActive ? 'admin-nav-link active' : 'admin-nav-link'
              }
            >
              Quản lý User
            </NavLink>
          </li>
        </ul>
        <div className='admin-sidebar-footer'>
          <a href='/' className='admin-nav-link'>
            Về trang chủ
          </a>
        </div>
      </nav>
      <main className='admin-content'>
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
