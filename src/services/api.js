import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:5258/api', // URL backend của bạn
  headers: {
    'Content-Type': 'application/json',
  },
})

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

export default apiClient
