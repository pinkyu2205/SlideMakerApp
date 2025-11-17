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
// Import API
import { getAllTemplates, getAllUsers } from '../../services/api'
import './AdminDashboardPage.css'

// Component StatCard (không đổi)
const StatCard = ({ title, value, icon, colorClass }) => (
  <div className={`stat-card ${colorClass || ''}`}>
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
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)

        // 1. Gọi API lấy dữ liệu
        // getAllTemplates(false) -> Lấy TẤT CẢ template (cả active & inactive) để đếm tổng
        const [usersResponse, templatesResponse] = await Promise.all([
          getAllUsers(),
          getAllTemplates(false),
        ])

        const users = usersResponse.data
        const templates = templatesResponse.data

        // 2. Tính toán số liệu User
        const totalUsers = users.length
        const totalTeachers = users.filter(
          (u) => u.roleName === 'Teacher'
        ).length
        const totalStudents = users.filter(
          (u) => u.roleName === 'Student'
        ).length
        const totalAdmins = users.filter((u) => u.roleName === 'Admin').length

        // 3. Tính toán Template
        const totalTemplates = templates.length

        // 4. Tính toán Chương trình học (Curriculum)
        // LƯU Ý: Hiện tại API getCurriculum bắt buộc phải chọn Lớp/Cấp.
        // Chưa có API lấy "Toàn bộ chủ đề". Tạm thời để 0 hoặc cần Backend hỗ trợ thêm.
        // const totalCurriculums = 0

        // 5. Tính người dùng mới trong 7 ngày
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

        const newUsersLast7Days = users.filter((u) => {
          if (!u.createdAt) return false
          return new Date(u.createdAt) > sevenDaysAgo
        })

        // 6. Data cho biểu đồ tròn (Role)
        const roleDistribution = [
          { name: 'Admin', value: totalAdmins },
          { name: 'Teacher', value: totalTeachers },
          { name: 'Student', value: totalStudents },
        ]

        // 7. Data cho biểu đồ cột (User mới theo ngày)
        const dailyNewUsers = Array(7)
          .fill(0)
          .map((_, i) => {
            const date = new Date()
            date.setDate(date.getDate() - i)
            const dateString = `${date.getDate()}/${date.getMonth() + 1}`
            return { name: dateString, count: 0 }
          })
          .reverse()

        newUsersLast7Days.forEach((user) => {
          const userDate = new Date(user.createdAt)
          const dateString = `${userDate.getDate()}/${userDate.getMonth() + 1}`
          const dayEntry = dailyNewUsers.find((d) => d.name === dateString)
          if (dayEntry) {
            dayEntry.count += 1
          }
        })

        setStats({
          totalUsers,
          totalTeachers,
          totalStudents,
          totalTemplates,
          // totalCurriculums, // Thêm thống kê này
          newUsersCount: newUsersLast7Days.length,
          roleDistribution,
          dailyNewUsersData: dailyNewUsers,
        })
      } catch (err) {
        console.error('Lỗi lấy thống kê', err)
        // Kiểm tra lỗi cụ thể
        if (err.response && err.response.status === 400) {
          setError('Lỗi Request (400). Vui lòng kiểm tra tham số API.')
        } else {
          setError('Không thể tải dữ liệu Dashboard.')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Màu biểu đồ
  const PIE_COLORS = {
    Admin: '#EF4444', // Đỏ
    Teacher: '#3B82F6', // Xanh dương
    Student: '#10B981', // Xanh lá
  }

  if (loading) return <p className='loading-text'>⏳ Đang tải thống kê...</p>
  if (error) return <p className='admin-error-message'>⚠️ {error}</p>
  if (!stats) return <p className='loading-text'>Không có dữ liệu.</p>

  return (
    <div className='admin-dashboard'>
      <h1 className='admin-page-title'>Dashboard Thống Kê</h1>

      <div className='stats-grid'>
        {/* Hàng 1: Tổng quan User */}
        <StatCard title='Tổng Người Dùng' value={stats.totalUsers} icon='👥' />
        <StatCard title='Giáo Viên' value={stats.totalTeachers} icon='🧑‍🏫' />
        <StatCard title='Học Sinh' value={stats.totalStudents} icon='🧑‍🎓' />

        {/* Hàng 2: Nội dung hệ thống */}
        <StatCard
          title='Tổng Templates'
          value={stats.totalTemplates}
          icon='📄'
        />
        {/* <StatCard
          title='Tổng Chủ Đề (GDPT)'
          value={stats.totalCurriculums || 'N/A'}
          icon='📚'
        /> */}
        <StatCard
          title='User Mới (7 ngày)'
          value={stats.newUsersCount}
          icon='✨'
        />
      </div>

      <div className='dashboard-charts'>
        {/* Biểu đồ cột */}
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
              <Bar
                dataKey='count'
                fill='#8884d8'
                name='Người dùng mới'
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Biểu đồ tròn */}
        <div className='chart-container'>
          <h2>Phân Bổ Vai Trò</h2>
          <ResponsiveContainer width='100%' height={300}>
            <PieChart>
              <Pie
                data={stats.roleDistribution}
                cx='50%'
                cy='50%'
                innerRadius={60} // Làm biểu đồ dạng Donut cho đẹp
                outerRadius={100}
                paddingAngle={5}
                dataKey='value'
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {stats.roleDistribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={PIE_COLORS[entry.name] || '#8884d8'}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign='bottom' height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardPage
