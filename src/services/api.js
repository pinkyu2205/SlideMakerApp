import axios from 'axios'

// Sử dụng proxy qua Vite dev server
const apiClient = axios.create({
  baseURL: '/api', // Proxy thông qua Vite dev server
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
})

// Thêm interceptor để đính kèm token vào mỗi request nếu có
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

// Hàm lấy chương trình học theo lớp (từ /api/GDPT)
export const getCurriculum = (gradeName, className) => {
  return apiClient.get('/GDPT', {
    params: {
      'grade-name': gradeName,
      'class-name': className
    }
  })
}

// Hàm cập nhật topic (Admin only)
export const updateTopic = (topicId, topicData) => {
  return apiClient.put(`/GDPT/topic/${topicId}`, topicData)
}

// Hàm deactivate topic (Admin only)
export const deactivateTopic = (topicId) => {
  return apiClient.put(`/GDPT/topic/${topicId}/deactivate`)
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
export default apiClient
