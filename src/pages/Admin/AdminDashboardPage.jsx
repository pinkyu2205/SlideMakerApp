import { useEffect, useState } from 'react'
import { getAdminStats } from '../../services/api'
import './AdminDashboardPage.css'

const StatCard = ({ title, value, icon }) => (
  <div className='stat-card'>
    <div className='stat-icon'>{icon}</div>
    <div className='stat-content'>
      <h3 className='stat-title'>{title}</h3>
      <p className='stat-value'>{value}</p>
    </div>
  </div>
)

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Gọi API để lấy số liệu thống kê
    getAdminStats()
      .then((response) => {
        setStats(response.data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Lỗi lấy thống kê', err)
        setLoading(false)
      })
  }, [])

  if (loading) return <p>Đang tải thống kê...</p>

  return (
    <div className='admin-dashboard'>
      <h1 className='admin-page-title'>Dashboard Thống Kê</h1>
      <div className='stats-grid'>
        <StatCard title='Tổng Người Dùng' value={stats.totalUsers} icon='👥' />
        <StatCard title='Giáo Viên' value={stats.totalTeachers} icon='🧑‍🏫' />
        <StatCard title='Học Sinh' value={stats.totalStudents} icon='🧑‍🎓' />
        <StatCard
          title='Tổng Templates'
          value={stats.totalTemplates}
          icon='📄'
        />
        <StatCard title='Slides Đã Tạo' value={stats.totalSlides} icon='📊' />
        <StatCard
          title='Lượt Đăng Nhập (24h)'
          value={stats.logins24h}
          icon='🕒'
        />
      </div>

      <div className='dashboard-charts'>
        <div className='chart-container'>
          <h2>Người Dùng Mới (7 Ngày)</h2>
          <div className='chart-placeholder'>
            <p>(Biểu đồ cột sẽ hiển thị ở đây)</p>
          </div>
        </div>
        <div className='chart-container'>
          <h2>Phân Bổ Vai Trò</h2>
          <div className='chart-placeholder'>
            <p>(Biểu đồ tròn sẽ hiển thị ở đây)</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardPage
