import axios from 'axios'

const BASE_URL = 'https://localhost:7259'

const apiClient = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    config.headers['Access-Control-Allow-Origin'] = '*'
    config.headers['Access-Control-Allow-Methods'] =
      'GET, POST, PUT, DELETE, OPTIONS'
    config.headers['Access-Control-Allow-Headers'] =
      'Content-Type, Authorization'
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

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
      url: error.config?.url,
    })
    return Promise.reject(error)
  }
)

export const getBaseUrl = () => BASE_URL

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

export const getUserProfile = () => {
  return apiClient.get('/auth/profile')
}

export const updateUserProfile = (userId, userData) => {
  return apiClient.put(`/auth/users/${userId}`, userData)
}

export const forgotPassword = (email) => {
  return apiClient.post('/auth/forgot-password', { email })
}

export const resetPassword = (data) => {
  return apiClient.post('/auth/reset-password', data)
}

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

// Tạo chương trình học (GDPT)
export const createCurriculum = (curriculumData) => {
  return apiClient.post('/GDPT/import', curriculumData)
}

// Import từ file
export const importCurriculumFromFile = (file) => {
  const formData = new FormData()
  formData.append('file', file)
  return apiClient.post('/GDPT/import-from-file', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

// --- BỔ SUNG CÁC API BỊ THIẾU ---

// Cập nhật thông tin Topic (PUT)
export const updateTopic = (topicId, topicData) => {
  return apiClient.put(`/GDPT/topics/${topicId}`, topicData)
}

// Xóa/Ẩn Topic (DELETE) - Mapping với hàm deleteTopic cũ
export const deleteTopic = (topicId) => {
  return apiClient.delete(`/GDPT/topics/${topicId}`)
}

// Alias cho deleteTopic để OptionsTemplatePage.jsx gọi được
export const deactivateTopic = deleteTopic

// ================= PPT TEMPLATE APIs =================
export const getTemplates = (onlyActive = false) => {
  return apiClient.get(`/template?onlyActive=${onlyActive}`)
}

export const getTemplateById = (id) => {
  return apiClient.get(`/template/${id}`)
}

export const createTemplate = (formData) => {
  return apiClient.post('/template', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export const updateTemplate = (id, formData) => {
  return apiClient.put(`/template/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export const deleteTemplate = (id) => {
  return apiClient.delete(`/template/${id}`)
}

export const downloadTemplate = (id) => {
  return apiClient.get(`/template/download/${id}`, {
    responseType: 'blob',
  })
}

export const getAllTemplates = getTemplates

export default apiClient
