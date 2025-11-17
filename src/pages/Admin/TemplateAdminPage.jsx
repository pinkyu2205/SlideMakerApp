import {
  Download,
  Edit,
  Plus,
  RefreshCw,
  Save,
  Search,
  Trash2,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  createTemplate,
  deleteTemplate,
  downloadTemplate,
  getBaseUrl,
  getTemplateById,
  getTemplates,
  updateTemplate,
} from '../../services/api'
import './TemplateAdminPage.css'

const TemplateAdminPage = () => {
  // --- STATE ---
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(false)
  const [filterActive, setFilterActive] = useState('true') // 'true' | 'false'
  const [searchId, setSearchId] = useState('')

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    description: '',
    templateType: '',
    tags: [], // Mảng các tag string
    isActive: true,
    file: null, // File PPTX mới
    thumbnail: null, // File ảnh mới
  })

  // Tag input tạm thời
  const [tagInput, setTagInput] = useState('')
  // Preview ảnh cũ (khi edit)
  const [previewThumbnailUrl, setPreviewThumbnailUrl] = useState('')

  // --- FETCH DATA ---
  const fetchTemplates = async () => {
    setLoading(true)
    try {
      // Nếu có searchId thì tìm theo ID
      if (searchId.trim()) {
        const res = await getTemplateById(searchId)
        // API trả về 1 object, ta bỏ vào mảng để render
        setTemplates([res.data])
      } else {
        // Nếu không thì lấy list theo filter active
        const res = await getTemplates(filterActive === 'true')
        setTemplates(res.data)
      }
    } catch (error) {
      console.error('Lỗi tải dữ liệu:', error)
      setTemplates([])
      if (searchId.trim()) alert('Không tìm thấy Template với ID này')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!searchId) {
      fetchTemplates()
    }
  }, [filterActive]) // Tải lại khi đổi tab Active/Inactive

  // --- HANDLERS ---

  const handleSearch = (e) => {
    e.preventDefault()
    fetchTemplates()
  }

  const handleResetSearch = () => {
    setSearchId('')
    fetchTemplates() // Gọi lại để lấy list đầy đủ
  }

  const handleDownload = async (id, name) => {
    try {
      const blob = await downloadTemplate(id)
      // Tạo link ảo để tải file
      const url = window.URL.createObjectURL(new Blob([blob.data]))
      const link = document.createElement('a')
      link.href = url
      // Đặt tên file (nếu backend không trả header filename chuẩn thì tự đặt)
      link.setAttribute('download', `${name || 'template'}.pptx`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error('Download error:', error)
      alert('Lỗi khi tải file. Có thể file không tồn tại.')
    }
  }

  const handleDelete = async (id) => {
    if (
      window.confirm('Bạn có chắc muốn xóa (hoặc vô hiệu hóa) template này?')
    ) {
      try {
        await deleteTemplate(id)
        alert('Xóa thành công!')
        fetchTemplates()
      } catch (error) {
        console.error(error)
        alert('Xóa thất bại')
      }
    }
  }

  // --- MODAL & FORM HANDLERS ---

  const openCreateModal = () => {
    setIsEditMode(false)
    setFormData({
      id: null,
      name: '',
      description: '',
      templateType: '',
      tags: [],
      isActive: true,
      file: null,
      thumbnail: null,
    })
    setTagInput('')
    setPreviewThumbnailUrl('')
    setIsModalOpen(true)
  }

  const openEditModal = (tpl) => {
    setIsEditMode(true)
    // Convert chuỗi tags "tag1, tag2" thành mảng ["tag1", "tag2"]
    const tagsArray = tpl.tags ? tpl.tags.split(',').map((t) => t.trim()) : []

    setFormData({
      id: tpl.templateID,
      name: tpl.name,
      description: tpl.description,
      templateType: tpl.templateType,
      tags: tagsArray,
      isActive: tpl.isActive,
      file: null, // Reset file input
      thumbnail: null, // Reset thumbnail input
    })
    setTagInput('')
    // URL ảnh từ backend (ghép với Base URL)
    setPreviewThumbnailUrl(
      tpl.thumbnailUrl ? `${getBaseUrl()}${tpl.thumbnailUrl}` : ''
    )
    setIsModalOpen(true)
  }

  // Xử lý Tags
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const val = tagInput.trim()
      if (val && !formData.tags.includes(val)) {
        setFormData((prev) => ({ ...prev, tags: [...prev.tags, val] }))
      }
      setTagInput('')
    }
  }
  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove),
    }))
  }

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Tạo FormData để gửi file
    const data = new FormData()
    data.append('Name', formData.name)
    data.append('Description', formData.description)
    data.append('TemplateType', formData.templateType)
    // Ghép mảng tags thành chuỗi "tag1, tag2"
    data.append('Tags', formData.tags.join(', '))
    data.append('IsActive', formData.isActive)

    // Xử lý file cho Create vs Update (tên field khác nhau theo Swagger)
    if (isEditMode) {
      // PUT logic
      if (formData.file) data.append('PptxFile', formData.file)
      if (formData.thumbnail) data.append('ThumbnailFile', formData.thumbnail)
    } else {
      // POST logic
      if (formData.file) data.append('File', formData.file)
      if (formData.thumbnail) data.append('ThumbnailImage', formData.thumbnail)
    }

    try {
      if (isEditMode) {
        await updateTemplate(formData.id, data)
        alert('Cập nhật thành công!')
      } else {
        await createTemplate(data)
        alert('Tạo mới thành công!')
      }
      setIsModalOpen(false)
      fetchTemplates()
    } catch (error) {
      console.error(error)
      alert('Lỗi: ' + (error.response?.data?.message || error.message))
    }
  }

  return (
    <div className='template-admin-page'>
      <div className='page-header'>
        <h1 className='admin-page-title'>Quản lý Template PowerPoint</h1>
        <button className='btn-primary' onClick={openCreateModal}>
          <Plus size={18} /> Thêm Template
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className='toolbar'>
        <div className='filter-group'>
          <label>Trạng thái:</label>
          <select
            value={filterActive}
            onChange={(e) => setFilterActive(e.target.value)}
            className='form-select'
          >
            <option value='true'>Đang hoạt động</option>
            <option value='false'>Đã xóa / Ẩn</option>
          </select>
        </div>

        <form onSubmit={handleSearch} className='search-group'>
          <input
            type='number'
            placeholder='Tìm theo ID...'
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className='form-input search-input'
          />
          <button type='submit' className='btn-secondary'>
            <Search size={18} />
          </button>
          {searchId && (
            <button
              type='button'
              className='btn-icon'
              onClick={handleResetSearch}
              title='Làm mới'
            >
              <RefreshCw size={18} />
            </button>
          )}
        </form>
      </div>

      {/* Table */}
      <div className='table-container'>
        {loading ? (
          <p className='text-center p-4'>⏳ Đang tải...</p>
        ) : (
          <table className='admin-table'>
            <thead>
              <tr>
                <th>ID</th>
                <th>Ảnh bìa</th>
                <th>Tên & Mô tả</th>
                <th>Loại</th>
                <th>Tags</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {templates.length === 0 ? (
                <tr>
                  <td colSpan='7' className='text-center p-4'>
                    Không tìm thấy dữ liệu
                  </td>
                </tr>
              ) : (
                templates.map((item) => (
                  <tr key={item.templateID}>
                    <td>{item.templateID}</td>
                    <td>
                      {item.thumbnailUrl ? (
                        <img
                          src={`${getBaseUrl()}${item.thumbnailUrl}`}
                          alt='thumb'
                          className='table-thumb'
                        />
                      ) : (
                        <span className='no-thumb'>No Img</span>
                      )}
                    </td>
                    <td>
                      <div className='fw-bold'>{item.name}</div>
                      <div className='text-muted small'>{item.description}</div>
                    </td>
                    <td>{item.templateType}</td>
                    <td>
                      <div className='tags-display'>
                        {item.tags
                          ? item.tags.split(',').map((tag, idx) => (
                              <span key={idx} className='tag-badge'>
                                {tag.trim()}
                              </span>
                            ))
                          : '-'}
                      </div>
                    </td>
                    <td>
                      <span
                        className={`status-badge ${
                          item.isActive ? 'active' : 'inactive'
                        }`}
                      >
                        {item.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className='action-buttons'>
                        <button
                          className='btn-icon-primary'
                          onClick={() => openEditModal(item)}
                          title='Sửa'
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className='btn-icon-success'
                          onClick={() =>
                            handleDownload(item.templateID, item.name)
                          }
                          title='Tải xuống'
                        >
                          <Download size={18} />
                        </button>
                        {item.isActive && (
                          <button
                            className='btn-icon-danger'
                            onClick={() => handleDelete(item.templateID)}
                            title='Xóa'
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className='modal-overlay'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h2>{isEditMode ? 'Cập nhật Template' : 'Tạo Template mới'}</h2>
              <button
                className='close-btn'
                onClick={() => setIsModalOpen(false)}
              >
                <X size={24} />
              </button>
            </div>
            <div className='modal-body'>
              <form id='templateForm' onSubmit={handleSubmit}>
                {/* Row 1: Tên & Loại */}
                <div className='form-row'>
                  <div className='form-group'>
                    <label>
                      Tên Template <span className='text-danger'>*</span>
                    </label>
                    <input
                      required
                      type='text'
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder='Nhập tên template...'
                    />
                  </div>
                  <div className='form-group'>
                    <label>Loại (Type)</label>
                    <input
                      type='text'
                      value={formData.templateType}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          templateType: e.target.value,
                        })
                      }
                      placeholder='VD: PowerPoint, Slide...'
                    />
                  </div>
                </div>

                {/* Row 2: Mô tả */}
                <div className='form-group'>
                  <label>Mô tả</label>
                  <textarea
                    rows='3'
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder='Mô tả ngắn về template...'
                  />
                </div>

                {/* Row 3: Tags */}
                <div className='form-group'>
                  <label>Tags (Nhấn Enter để thêm)</label>
                  <div className='tags-input-container'>
                    {formData.tags.map((tag, index) => (
                      <span key={index} className='tag-pill'>
                        {tag}{' '}
                        <button type='button' onClick={() => removeTag(tag)}>
                          ×
                        </button>
                      </span>
                    ))}
                    <input
                      type='text'
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                      placeholder='Nhập tag...'
                    />
                  </div>
                </div>

                {/* Row 4: File Uploads Layout Mới */}
                <div className='upload-section'>
                  {/* Cột Trái: Input Files */}
                  <div className='upload-inputs'>
                    {/* File PowerPoint */}
                    <div className='form-group'>
                      <label>
                        File PowerPoint (.pptx){' '}
                        {isEditMode ? (
                          <span
                            className='text-muted'
                            style={{ fontWeight: 'normal', fontSize: '0.85em' }}
                          >
                            (Bỏ qua nếu không đổi)
                          </span>
                        ) : (
                          <span className='text-danger'>*</span>
                        )}
                      </label>
                      <div className='custom-file-input'>
                        <input
                          type='file'
                          accept='.pptx'
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              file: e.target.files[0],
                            })
                          }
                          required={!isEditMode}
                        />
                      </div>
                    </div>

                    {/* Thumbnail Input */}
                    <div className='form-group'>
                      <label>Ảnh bìa (Thumbnail)</label>
                      <div className='custom-file-input'>
                        <input
                          type='file'
                          accept='image/*'
                          onChange={(e) => {
                            if (e.target.files[0]) {
                              setFormData({
                                ...formData,
                                thumbnail: e.target.files[0],
                              })
                              setPreviewThumbnailUrl(
                                window.URL.createObjectURL(e.target.files[0])
                              )
                            }
                          }}
                        />
                      </div>
                    </div>

                    {/* Active Checkbox - Chuyển xuống đây cho gọn */}
                    <div className='form-group checkbox-wrapper'>
                      <label className='switch-label'>
                        <input
                          type='checkbox'
                          checked={formData.isActive}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              isActive: e.target.checked,
                            })
                          }
                        />
                        <span className='slider round'></span>
                        <span className='label-text'>
                          Đang hoạt động (Active)
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Cột Phải: Preview Ảnh */}
                  <div className='upload-preview'>
                    <label>Preview Ảnh Bìa:</label>
                    <div className='thumb-preview-box'>
                      {previewThumbnailUrl ? (
                        <img src={previewThumbnailUrl} alt='Preview' />
                      ) : (
                        <div className='no-preview'>Chưa có ảnh</div>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className='modal-footer'>
              <button
                className='btn-cancel'
                onClick={() => setIsModalOpen(false)}
              >
                Hủy
              </button>
              <button type='submit' form='templateForm' className='btn-save'>
                <Save size={18} style={{ marginRight: '5px' }} /> Lưu Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TemplateAdminPage
