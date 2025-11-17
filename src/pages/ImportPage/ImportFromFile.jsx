import { useState } from 'react'
import { importCurriculumFromFile } from '../../services/api'
import './ImportPage.css'

const ImportFromFile = () => {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [progress, setProgress] = useState(0)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    
    if (selectedFile) {
      // Kiểm tra định dạng file
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    
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
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + Math.random() * 30, 90))
      }, 500)

      const response = await importCurriculumFromFile(file)
      
      clearInterval(progressInterval)
      setProgress(100)

      console.log('✅ File upload successful:', response.data)
      setSuccess(`✅ Tải file lên thành công! (${file.name})`)
      setFile(null)
      
      // Reset after 3 seconds
      setTimeout(() => {
        setFile(null)
        setProgress(0)
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
    setFile(null)
    setError(null)
    setSuccess(null)
    setProgress(0)
  }

  return (
    <div className='import-container'>
      <div className='import-wrapper'>
        {/* Header */}
        <div className='import-header'>
          <h1 className='import-title'>Nhập Dữ Liệu Từ File</h1>
          <p className='import-subtitle'>
            Tải file (JSON, CSV, XLSX) để nhập dữ liệu chương trình học
          </p>
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

        {/* File Upload Form */}
        <form onSubmit={handleSubmit} className='import-form'>
          <div className='form-section'>
            <h2 className='form-section-title'>📁 Tải Lên File</h2>
            
            {/* File Input Area */}
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

            {/* File Info */}
            {file && (
              <div className='file-info'>
                <p><strong>Tên file:</strong> {file.name}</p>
                <p><strong>Kích thước:</strong> {(file.size / 1024).toFixed(2)} KB</p>
                <p><strong>Loại:</strong> {file.type || 'Không xác định'}</p>
              </div>
            )}
          </div>

          {/* Progress Bar */}
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

          {/* Info Box */}
          <div className='form-section info-box'>
            <h3 className='info-title'>ℹ️ Định Dạng File Được Hỗ Trợ</h3>
            <ul className='info-list'>
              <li><strong>JSON:</strong> Định dạng chuẩn với các trường: gradeName, className, topicName, etc.</li>
              <li><strong>CSV:</strong> Các cột: gradeName, className, topicName, strandName, contentTitle, contentSummary</li>
              <li><strong>XLSX/XLS:</strong> Các cột như CSV với sheet tên "Curriculum"</li>
            </ul>
          </div>

          {/* Buttons */}
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
        </form>

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
      </div>
    </div>
  )
}

export default ImportFromFile
