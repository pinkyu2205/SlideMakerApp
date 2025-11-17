import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:5258/api', // URL backend của bạn
  headers: {
    'Content-Type': 'application/json',
  },
})

// Thêm interceptor để đính kèm token vào mỗi request nếu có
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export const login = (credentials) => {
  return apiClient.post('/Auth/login', credentials)
}

export const register = (userData) => {
  // Backend yêu cầu RoleID là số (Teacher: 2, Student: 3)
  const roleID = userData.role === 'Teacher' ? 2 : 3
  const dataToSend = {
    username: userData.username,
    email: userData.email,
    password: userData.password,
    roleID: roleID,
  }
  return apiClient.post('/Auth/register', dataToSend)
}

// Hàm lấy dữ liệu cho các bộ lọc
export const getGradesAndClasses = () => {
  // Giả định bạn có endpoint này để lấy tất cả cấp học và lớp học
  return apiClient.get('/GDPT/grades-and-classes')
}

// Hàm lấy chương trình học theo lớp
export const getCurriculum = (gradeName, className) => {
  return apiClient.get(
    `/GDPT/curriculum?gradeName=${gradeName}&className=${className}`
  )
}

// Hàm lấy tất cả templates
export const getAllTemplates = (onlyActive = true) => {
  return apiClient.get(`/Template?onlyActive=${onlyActive}`)
}

// Hàm lấy chi tiết một template
export const getTemplateById = (id) => {
  return apiClient.get(`/Template/${id}`)
}

// ================= ADMIN APIs =================

export const getAdminStats = () => {
  const mockStats = {
    totalUsers: 150,
    totalTeachers: 45,
    totalStudents: 105,
    totalTemplates: 12,
    totalSlides: 320,
    logins24h: 35,
  }
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: mockStats })
    }, 500)
  })
}

export const getAllUsers = () => {
  return apiClient.get('/admin/users')
}

export const deleteUser = (userId) => {
  return apiClient.delete(`/admin/users/${userId}`)
}

export const getAdminRoles = () => {
  return apiClient.get('/admin/roles')
}

export const updateUser = (userId, updateData) => {
  return apiClient.put(`/admin/users/${userId}`, updateData)
}

export default apiClient
