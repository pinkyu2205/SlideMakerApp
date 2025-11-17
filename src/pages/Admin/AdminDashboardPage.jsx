import { useEffect, useState } from 'react'
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { getAllTemplates, getAllUsers } from '../../services/api'
import './AdminDashboardPage.css'

// Component StatCard (không đổi)
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
  const [error, setError] = useState(null)

  useEffect(() => {
    // 1. Tạo hàm async để gọi nhiều API
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)

        // 2. Gọi API Users và Templates cùng lúc
        const [usersResponse, templatesResponse] = await Promise.all([
          getAllUsers(),
          getAllTemplates(),
        ])

        const users = usersResponse.data
        const templates = templatesResponse.data

        // 3. Tính toán số liệu

        // 3.1. Tính tổng user, teacher, student
        const totalUsers = users.length
        const totalTeachers = users.filter(
          (u) => u.roleName === 'Teacher'
        ).length
        const totalStudents = users.filter(
          (u) => u.roleName === 'Student'
        ).length
        const totalAdmins = users.filter((u) => u.roleName === 'Admin').length

        // 3.2. Tính tổng templates
        const totalTemplates = templates.length

        // 3.3. Tính người dùng mới trong 7 ngày
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

        const newUsersLast7Days = users.filter((u) => {
          return new Date(u.createdAt) > sevenDaysAgo
        })

        // 3.4. Chuẩn bị data cho biểu đồ phân bổ
        const roleDistribution = [
          { name: 'Admin', value: totalAdmins },
          { name: 'Teacher', value: totalTeachers },
          { name: 'Student', value: totalStudents },
        ]

        // 3.5. Chuẩn bị data cho biểu đồ người dùng mới
        // (Tạo 7 cột cho 7 ngày gần nhất)
        const dailyNewUsers = Array(7)
          .fill(0)
          .map((_, i) => {
            const date = new Date()
            date.setDate(date.getDate() - i)
            const dateString = `${date.getDate()}/${date.getMonth() + 1}`
            return { name: dateString, count: 0 }
          })
          .reverse() // Sắp xếp từ cũ đến mới

        newUsersLast7Days.forEach((user) => {
          const userDate = new Date(user.createdAt)
          const dateString = `${userDate.getDate()}/${userDate.getMonth() + 1}`
          const dayEntry = dailyNewUsers.find((d) => d.name === dateString)
          if (dayEntry) {
            dayEntry.count += 1
          }
        })

        // 4. Lưu kết quả vào state
        setStats({
          totalUsers,
          totalTeachers,
          totalStudents,
          totalTemplates,
          newUsersCount: newUsersLast7Days.length, // Tổng số người dùng mới
          roleDistribution, // Data cho biểu đồ tròn
          dailyNewUsersData: dailyNewUsers, // Data cho biểu đồ cột
        })
      } catch (err) {
        console.error('Lỗi lấy thống kê', err)
        setError('Không thể tải dữ liệu Dashboard.')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, []) // Chỉ chạy 1 lần

  // Màu cho biểu đồ tròn
  const PIE_COLORS = {
    Admin: '#EF4444', // Đỏ
    Teacher: '#3B82F6', // Xanh
    Student: '#10B981', // Xanh lá
  }

  if (loading) return <p className='loading-text'>Đang tải thống kê...</p>
  if (error) return <p className='admin-error-message'>{error}</p>
  if (!stats) return <p className='loading-text'>Không có dữ liệu.</p>

  return (
    <div className='admin-dashboard'>
      <h1 className='admin-page-title'>Dashboard Thống Kê</h1>

      {/* 5. Hiển thị số liệu đã tính toán */}
      <div className='stats-grid'>
        <StatCard title='Tổng Người Dùng' value={stats.totalUsers} icon='👥' />
        <StatCard title='Giáo Viên' value={stats.totalTeachers} icon='🧑‍🏫' />
        <StatCard title='Học Sinh' value={stats.totalStudents} icon='🧑‍🎓' />
        <StatCard
          title='Tổng Templates'
          value={stats.totalTemplates}
          icon='📄'
        />
        <StatCard
          title='Người Dùng Mới (7 ngày)'
          value={stats.newUsersCount}
          icon='✨'
        />
      </div>

      <div className='dashboard-charts'>
        {/* BIỂU ĐỒ CỘT - Người dùng mới */}
        <div className='chart-container'>
          <h2>Người Dùng Mới (7 Ngày)</h2>
          <ResponsiveContainer width='100%' height={300}>
            <BarChart
              data={stats.dailyNewUsersData}
              margin={{ top: 20, right: 0, left: -20, bottom: 5 }}
            >
              <XAxis dataKey='name' />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey='count' fill='#8884d8' name='Người dùng mới' />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* BIỂU ĐỒ TRÒN - Phân bổ vai trò */}
        <div className='chart-container'>
          <h2>Phân Bổ Vai Trò</h2>
          <ResponsiveContainer width='100%' height={300}>
            <PieChart>
              <Pie
                data={stats.roleDistribution}
                cx='50%'
                cy='50%'
                outerRadius={100}
                fill='#8884d8'
                dataKey='value'
                label={(entry) => `${entry.name}: ${entry.value}`}
              >
                {stats.roleDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardPage
