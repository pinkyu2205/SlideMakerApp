import { useEffect, useState } from 'react'
import TemplateCard from '../../components/TemplateCard/TemplateCard'
import { getAllTemplates } from '../../services/api'
import './TemplateLibraryPage.css'

const TemplateLibraryPage = () => {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true)
        // Gọi API; dựa trên controller, 'false' để lấy tất cả template
        const response = await getAllTemplates(false)
        setTemplates(response.data)
        setError(null)
      } catch (err) {
        setError('Không thể tải danh sách template.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchTemplates()
  }, [])

  const handleSelectTemplate = (id) => {
    // Tương lai: Mở modal chi tiết hoặc chuyển trang
    console.log('Đã chọn template ID:', id)
    // Ví dụ: navigate(`/template/${id}`)
  }

  return (
    <div className='template-library-container'>
      <h1 className='template-library-title'>Thư viện Template</h1>
      <p className='template-library-subtitle'>
        Chọn một template để bắt đầu tạo slide của bạn
      </p>

      {loading && <p>Đang tải templates...</p>}
      {error && <p className='error-message'>{error}</p>}

      {!loading && !error && (
        <div className='template-grid'>
          {templates.map((template) => (
            <TemplateCard
              key={template.templateID}
              template={template}
              onSelect={handleSelectTemplate}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default TemplateLibraryPage
