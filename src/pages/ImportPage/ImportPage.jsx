import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { importCurriculum, importCurriculumFromFile } from '../../services/api'
import './ImportPage.css'

const ImportPage = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('form') // 'form' or 'file'
  
  // Form Tab State
  const [formData, setFormData] = useState({
    gradeName: '',
    className: '',
    topicName: '',
    strandName: '',
    contentTitle: '',
    contentSummary: '',
  })
  
  // File Tab State
  const [file, setFile] = useState(null)
  const [progress, setProgress] = useState(0)
  
  // General State
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  // Grade and Class Options
  const gradeOptions = [
    { value: 'Cấp 1', label: 'Cấp 1 (Lớp 1-5)' },
    { value: 'Cấp 2', label: 'Cấp 2 (Lớp 6-9)' },
    { value: 'Cấp 3', label: 'Cấp 3 (Lớp 10-12)' },
  ]

  const classOptions = {
    'Cấp 1': ['Lớp 1', 'Lớp 2', 'Lớp 3', 'Lớp 4', 'Lớp 5'],
    'Cấp 2': ['Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9'],
    'Cấp 3': ['Lớp 10', 'Lớp 11', 'Lớp 12'],
  }

  // Check if user is admin
  const checkAdminAccess = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (user.roleID !== 1 && user.role !== 'Admin') {
      setError('❌ Chỉ admin mới có quyền truy cập trang này')
      setTimeout(() => navigate('/'), 2000)
      return false
    }
    return true
  }

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    
    if (!checkAdminAccess()) return

    if (!formData.gradeName || !formData.className || !formData.topicName) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc')
      return
    }

    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      // Build the correct API payload structure
      const payload = {
        topics: [
          {
            topicName: formData.topicName,
            className: formData.className,
            gradeName: formData.gradeName,
            strandName: formData.strandName || '',
            objectives: '',
            source: '',
            contents: formData.contentTitle || formData.contentSummary ? [
              {
                title: formData.contentTitle || '',
                summary: formData.contentSummary || '',
                formulas: [],
                examples: [],
                media: [],
              }
            ] : [],
          }
        ]
      }

      console.log('📤 Importing curriculum data:', payload)
      const response = await importCurriculum(payload)
      
      console.log('✅ Import successful:', response.data)
      setSuccess('✅ Nhập dữ liệu thành công!')
      
      setFormData({
        gradeName: '',
        className: '',
        topicName: '',
        strandName: '',
        contentTitle: '',
        contentSummary: '',
      })
      
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      console.error('❌ Import error:', err)
      setError(
        err.response?.data?.message ||
        err.message ||
        'Lỗi nhập dữ liệu. Vui lòng thử lại.'
      )
    } finally {
      setLoading(false)
    }
  }

  // File handlers
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    
    if (selectedFile) {
      const allowedTypes = [
        'application/json',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv',
      ]
      
      if (!allowedTypes.includes(selectedFile.type) && 
          !selectedFile.name.match(/\.(json|csv|xlsx|xls)$/)) {
        setError('❌ Chỉ chấp nhận file: JSON, CSV, XLSX, XLS')
        setFile(null)
        return
      }

      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('❌ Kích thước file không được vượt quá 10MB')
        setFile(null)
        return
      }

      setFile(selectedFile)
      setError(null)
    }
  }

  const handleFileSubmit = async (e) => {
    e.preventDefault()
    
    if (!checkAdminAccess()) return
    
    if (!file) {
      setError('❌ Vui lòng chọn file')
      return
    }

    try {
      setLoading(true)
      setError(null)
      setSuccess(null)
      setProgress(0)

      console.log('📤 Uploading file:', file.name)
      
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + Math.random() * 30, 90))
      }, 500)

      const response = await importCurriculumFromFile(file)
      
      clearInterval(progressInterval)
      setProgress(100)

      console.log('✅ File upload successful:', response.data)
      setSuccess(`✅ Tải file lên thành công! (${file.name})`)
      setFile(null)
      
      setTimeout(() => {
        setFile(null)
        setProgress(0)
        setSuccess(null)
      }, 3000)
    } catch (err) {
      console.error('❌ File upload error:', err)
      setError(
        err.response?.data?.message ||
        err.message ||
        'Lỗi tải file. Vui lòng thử lại.'
      )
      setProgress(0)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    if (activeTab === 'form') {
      setFormData({
        gradeName: '',
        className: '',
        topicName: '',
        strandName: '',
        contentTitle: '',
        contentSummary: '',
      })
    } else {
      setFile(null)
      setProgress(0)
    }
    setError(null)
    setSuccess(null)
  }

  return (
    <div className='import-container'>
      <div className='import-wrapper'>
        {/* Header */}
        <div className='import-header'>
          <h1 className='import-title'>Nhập Dữ Liệu Chương Trình Học</h1>
          <p className='import-subtitle'>
            Nhập dữ liệu chương trình học thông qua form hoặc upload file
          </p>
        </div>

        {/* Tabs */}
        <div className='tabs-container'>
          <div className='tabs-header'>
            <button
              className={`tab-button ${activeTab === 'form' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('form')
                setError(null)
                setSuccess(null)
              }}
            >
              <span className='tab-icon'>📝</span>
              Nhập Từ Form
            </button>
            <button
              className={`tab-button ${activeTab === 'file' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('file')
                setError(null)
                setSuccess(null)
              }}
            >
              <span className='tab-icon'>📁</span>
              Upload File
            </button>
          </div>

          {/* Alert Messages */}
          {error && (
            <div className='alert alert-error'>
              <span>{error}</span>
              <button onClick={() => setError(null)}>✕</button>
            </div>
          )}
          
          {success && (
            <div className='alert alert-success'>
              <span>{success}</span>
              <button onClick={() => setSuccess(null)}>✕</button>
            </div>
          )}

          {/* Tab Content */}
          <div className='tabs-content'>
            {/* Form Tab */}
            {activeTab === 'form' && (
              <form onSubmit={handleFormSubmit} className='import-form'>
                <div className='form-section'>
                  <h2 className='form-section-title'>📚 Thông Tin Cơ Bản</h2>
                  
                  <div className='form-group'>
                    <label htmlFor='gradeName' className='form-label'>
                      Cấp Học <span className='required'>*</span>
                    </label>
                    <select
                      id='gradeName'
                      name='gradeName'
                      value={formData.gradeName}
                      onChange={handleInputChange}
                      className='form-select'
                      required
                    >
                      <option value=''>-- Chọn Cấp Học --</option>
                      {gradeOptions.map((grade) => (
                        <option key={grade.value} value={grade.value}>
                          {grade.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className='form-group'>
                    <label htmlFor='className' className='form-label'>
                      Lớp Học <span className='required'>*</span>
                    </label>
                    <select
                      id='className'
                      name='className'
                      value={formData.className}
                      onChange={handleInputChange}
                      className='form-select'
                      disabled={!formData.gradeName}
                      required
                    >
                      <option value=''>-- Chọn Lớp Học --</option>
                      {formData.gradeName && classOptions[formData.gradeName]?.map((cls) => (
                        <option key={cls} value={cls}>
                          {cls}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className='form-section'>
                  <h2 className='form-section-title'>📖 Thông Tin Chủ Đề</h2>
                  
                  <div className='form-group'>
                    <label htmlFor='topicName' className='form-label'>
                      Tên Chủ Đề <span className='required'>*</span>
                    </label>
                    <input
                      type='text'
                      id='topicName'
                      name='topicName'
                      value={formData.topicName}
                      onChange={handleInputChange}
                      className='form-input'
                      placeholder='VD: Phân số'
                      required
                    />
                  </div>

                  <div className='form-group'>
                    <label htmlFor='strandName' className='form-label'>
                      Lĩnh Vực / Strand
                    </label>
                    <input
                      type='text'
                      id='strandName'
                      name='strandName'
                      value={formData.strandName}
                      onChange={handleInputChange}
                      className='form-input'
                      placeholder='VD: Số, Đại số và Giải tích'
                    />
                  </div>
                </div>

                <div className='form-section'>
                  <h2 className='form-section-title'>📝 Thông Tin Nội Dung</h2>
                  
                  <div className='form-group'>
                    <label htmlFor='contentTitle' className='form-label'>
                      Tiêu Đề Nội Dung
                    </label>
                    <input
                      type='text'
                      id='contentTitle'
                      name='contentTitle'
                      value={formData.contentTitle}
                      onChange={handleInputChange}
                      className='form-input'
                      placeholder='VD: Khái niệm phân số'
                    />
                  </div>

                  <div className='form-group'>
                    <label htmlFor='contentSummary' className='form-label'>
                      Mô Tả / Tóm Tắt
                    </label>
                    <textarea
                      id='contentSummary'
                      name='contentSummary'
                      value={formData.contentSummary}
                      onChange={handleInputChange}
                      className='form-textarea'
                      placeholder='Nhập mô tả chi tiết về nội dung...'
                      rows='4'
                    />
                  </div>
                </div>

                <div className='form-actions'>
                  <button
                    type='button'
                    onClick={handleReset}
                    className='btn btn-secondary'
                    disabled={loading}
                  >
                    🔄 Đặt Lại
                  </button>
                  <button
                    type='submit'
                    className='btn btn-primary'
                    disabled={loading}
                  >
                    {loading ? '⏳ Đang xử lý...' : '✓ Nhập Dữ Liệu'}
                  </button>
                </div>
              </form>
            )}

            {/* File Tab */}
            {activeTab === 'file' && (
              <form onSubmit={handleFileSubmit} className='import-form'>
                <div className='form-section'>
                  <h2 className='form-section-title'>📁 Tải Lên File</h2>
                  
                  <div className='file-upload-area'>
                    <input
                      type='file'
                      id='fileInput'
                      onChange={handleFileChange}
                      accept='.json,.csv,.xlsx,.xls'
                      className='file-input'
                      disabled={loading}
                    />
                    <label htmlFor='fileInput' className='file-upload-label'>
                      <div className='file-upload-icon'>📄</div>
                      <div className='file-upload-text'>
                        <p className='file-upload-main'>
                          {file ? `✅ ${file.name}` : '📌 Chọn file hoặc kéo thả vào đây'}
                        </p>
                        <p className='file-upload-sub'>
                          {file 
                            ? `Kích thước: ${(file.size / 1024).toFixed(2)} KB`
                            : 'Hỗ trợ: JSON, CSV, XLSX, XLS (Max 10MB)'}
                        </p>
                      </div>
                    </label>
                  </div>

                  {file && (
                    <div className='file-info'>
                      <p><strong>Tên file:</strong> {file.name}</p>
                      <p><strong>Kích thước:</strong> {(file.size / 1024).toFixed(2)} KB</p>
                      <p><strong>Loại:</strong> {file.type || 'Không xác định'}</p>
                    </div>
                  )}
                </div>

                {loading && (
                  <div className='form-section'>
                    <div className='progress-container'>
                      <div className='progress-bar'>
                        <div 
                          className='progress-fill' 
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <p className='progress-text'>{Math.round(progress)}%</p>
                    </div>
                  </div>
                )}

                <div className='form-section info-box'>
                  <h3 className='info-title'>ℹ️ Định Dạng File Được Hỗ Trợ</h3>
                  <ul className='info-list'>
                    <li><strong>JSON:</strong> Định dạng chuẩn với các trường: gradeName, className, topicName, etc.</li>
                    <li><strong>CSV:</strong> Các cột: gradeName, className, topicName, strandName, contentTitle, contentSummary</li>
                    <li><strong>XLSX/XLS:</strong> Các cột như CSV với sheet tên "Curriculum"</li>
                  </ul>
                </div>

                <div className='form-actions'>
                  <button
                    type='button'
                    onClick={handleReset}
                    className='btn btn-secondary'
                    disabled={loading}
                  >
                    🔄 Đặt Lại
                  </button>
                  <button
                    type='submit'
                    className='btn btn-primary'
                    disabled={loading || !file}
                  >
                    {loading ? '⏳ Đang xử lý...' : '✓ Tải Lên File'}
                  </button>
                </div>

                {/* Template Download */}
                <div className='template-section'>
                  <h3 className='template-title'>📥 Tải Mẫu File</h3>
                  <p className='template-description'>
                    Tải mẫu file để xem định dạng đúng trước khi nhập dữ liệu
                  </p>
                  <div className='template-buttons'>
                    <a href='/templates/curriculum-template.json' download className='btn btn-outline'>
                      📄 Mẫu JSON
                    </a>
                    <a href='/templates/curriculum-template.csv' download className='btn btn-outline'>
                      📊 Mẫu CSV
                    </a>
                    <a href='/templates/curriculum-template.xlsx' download className='btn btn-outline'>
                      📑 Mẫu XLSX
                    </a>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImportPage
