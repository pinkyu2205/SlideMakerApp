import axios from 'axios'

const BASE_URL = 'https://localhost:7259' // Export base URL để dùng hiển thị ảnh

const apiClient = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor để tự động đính kèm Token
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

// Helper lấy Base URL (cho ảnh thumbnail)
export const getBaseUrl = () => BASE_URL

// ================= AUTH APIs =================
export const login = (credentials) => {
  return apiClient.post('/auth/login', credentials)
}

export const register = (userData) => {
  const roleID = userData.role === 'Teacher' ? 2 : 3
  const dataToSend = {
    username: userData.username,
    email: userData.email,
    password: userData.password,
    roleID: roleID,
  }
  return apiClient.post('/auth/register', dataToSend)
}

// ================= ADMIN USER APIs =================
// (Giữ nguyên mock stats hoặc thay bằng API thật nếu có)
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

export default apiClient
