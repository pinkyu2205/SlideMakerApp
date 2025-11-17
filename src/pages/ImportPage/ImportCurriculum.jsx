import { useState } from 'react'
import { importCurriculum } from '../../services/api'
import './ImportPage.css'

const ImportCurriculum = () => {
  const [formData, setFormData] = useState({
    gradeName: '',
    className: '',
    topicName: '',
    strandName: '',
    contentTitle: '',
    contentSummary: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

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

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.gradeName || !formData.className || !formData.topicName) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc')
      return
    }

    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      console.log('📤 Importing curriculum data:', formData)
      const response = await importCurriculum(formData)
      
      console.log('✅ Import successful:', response.data)
      setSuccess('✅ Nhập dữ liệu thành công!')
      
      // Reset form
      setFormData({
        gradeName: '',
        className: '',
        topicName: '',
        strandName: '',
        contentTitle: '',
        contentSummary: '',
      })
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

  const handleReset = () => {
    setFormData({
      gradeName: '',
      className: '',
      topicName: '',
      strandName: '',
      contentTitle: '',
      contentSummary: '',
    })
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
            Nhập dữ liệu chương trình học trực tiếp thông qua form
          </p>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className='alert alert-error'>
            <span>⚠️ {error}</span>
            <button onClick={() => setError(null)}>✕</button>
          </div>
        )}
        
        {success && (
          <div className='alert alert-success'>
            <span>{success}</span>
            <button onClick={() => setSuccess(null)}>✕</button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className='import-form'>
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
              disabled={loading}
            >
              {loading ? '⏳ Đang xử lý...' : '✓ Nhập Dữ Liệu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ImportCurriculum
