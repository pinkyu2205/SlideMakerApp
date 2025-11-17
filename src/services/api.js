import axios from 'axios'

<<<<<<< HEAD
const BASE_URL = 'https://localhost:7259' // Export base URL để dùng hiển thị ảnh

const apiClient = axios.create({
  baseURL: `${BASE_URL}/api`,
=======
// Sử dụng proxy qua Vite dev server
const apiClient = axios.create({
  baseURL: '/api', // Proxy thông qua Vite dev server
>>>>>>> origin/main
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
})

// Interceptor để tự động đính kèm Token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    // Thêm CORS headers
    config.headers['Access-Control-Allow-Origin'] = '*'
    config.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    config.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

<<<<<<< HEAD
// Helper lấy Base URL (cho ảnh thumbnail)
export const getBaseUrl = () => BASE_URL

// ================= AUTH APIs =================
=======
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error('API Error Details:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
      }
    })
    return Promise.reject(error)
  }
)

>>>>>>> origin/main
export const login = (credentials) => {
  return apiClient.post('/Auth/login', credentials)
}

export const register = (userData) => {
  const roleID = userData.role === 'Teacher' ? 2 : 3
  const dataToSend = {
    username: userData.username,
    email: userData.email,
    password: userData.password,
    roleID: roleID,
  }
  return apiClient.post('/Auth/register', dataToSend)
}

<<<<<<< HEAD
// ================= ADMIN USER APIs =================
// (Giữ nguyên mock stats hoặc thay bằng API thật nếu có)
=======
// Hàm lấy dữ liệu cho các bộ lọc
export const getGradesAndClasses = () => {
  // Giả định bạn có endpoint này để lấy tất cả cấp học và lớp học
  return apiClient.get('/GDPT/grades-and-classes')
}

// Hàm lấy tất cả templates
export const getAllTemplates = (onlyActive = true) => {
  return apiClient.get(`/Template?onlyActive=${onlyActive}`)
}

// Hàm lấy chi tiết một template
export const getTemplateById = (id) => {
  return apiClient.get(`/Template/${id}`)
}

// Hàm import dữ liệu chương trình (POST)
export const importCurriculum = (data) => {
  return apiClient.post('/GDPT/import', data)
}

// Hàm import dữ liệu từ file (POST với FormData)
export const importCurriculumFromFile = (file) => {
  const formData = new FormData()
  formData.append('file', file)
  return apiClient.post('/GDPT/import-from-file', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// ================= ADMIN APIs =================

>>>>>>> origin/main
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

export const updateUser = (userId, userData) => {
  return apiClient.put(`/admin/users/${userId}`, userData)
}

// ================= GDPT / CURRICULUM APIs =================
// (Dùng cho trang Quản lý Chương trình học)

export const getGradesAndClasses = () => {
  return apiClient.get('/GDPT/grades-and-classes')
}

export const getCurriculum = (gradeName, className, isActive) => {
  const params = {
    'grade-name': gradeName,
    'class-name': className,
  }
  if (isActive !== '' && isActive !== null && isActive !== undefined) {
    params['is-active'] = isActive
  }

  return apiClient.get('/GDPT', { params })
}

// [ĐỔI TÊN] createTemplate cũ -> createCurriculum
// Để tránh trùng với createTemplate của PowerPoint
export const createCurriculum = (curriculumData) => {
  return apiClient.post('/GDPT/import', curriculumData)
}

export const deleteTopic = (topicId) => {
  return apiClient.delete(`/GDPT/topics/${topicId}`)
}

<<<<<<< HEAD
// ================= PPT TEMPLATE APIs =================
// (Dùng cho trang Quản lý Template PowerPoint)

// Lấy danh sách Template
export const getTemplates = (onlyActive = false) => {
  return apiClient.get(`/template?onlyActive=${onlyActive}`)
}

// Lấy chi tiết Template
export const getTemplateById = (id) => {
  return apiClient.get(`/template/${id}`)
}

// Tạo Template mới (Multipart/form-data)
export const createTemplate = (formData) => {
  return apiClient.post('/template', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

// Cập nhật Template (Multipart/form-data)
export const updateTemplate = (id, formData) => {
  return apiClient.put(`/template/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

// Xóa Template
export const deleteTemplate = (id) => {
  return apiClient.delete(`/template/${id}`)
}

// Tải file Template
export const downloadTemplate = (id) => {
  return apiClient.get(`/template/download/${id}`, {
    responseType: 'blob',
  })
}

// Alias để tương thích ngược (nếu có component nào đang dùng getAllTemplates)
export const getAllTemplates = getTemplates

=======
// Lấy thông tin hồ sơ người dùng hiện tại
export const getUserProfile = () => {
  return apiClient.get('/auth/profile')
}

// Cập nhật hồ sơ người dùng
export const updateUserProfile = (userId, userData) => {
  // userData gồm: username, email, newPassword (nếu có)
  return apiClient.put(`/auth/users/${userId}`, userData)
}

// Quên mật khẩu (Gửi yêu cầu reset)
export const forgotPassword = (email) => {
  return apiClient.post('/auth/forgot-password', { email })
}

// Đặt lại mật khẩu (Dùng token)
export const resetPassword = (data) => {
  // data gồm: email, token, newPassword
  return apiClient.post('/auth/reset-password', data)
}

>>>>>>> origin/main
export default apiClient
