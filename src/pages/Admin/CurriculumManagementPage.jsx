import 'katex/dist/katex.min.css'
import {
  ChevronDown,
  ChevronRight,
  HelpCircle,
  Plus,
  Trash2,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { InlineMath } from 'react-katex'
import KaTeXCheatSheet from '../../components/Common/KaTeXCheatSheet'
import { createTemplate, deleteTopic, getCurriculum } from '../../services/api'
import './CurriculumManagementPage.css'

// --- CẤU HÌNH MAPPING CẤP - LỚP ---
const GRADE_CLASS_MAPPING = {
  'Cấp 1': ['Lớp 1', 'Lớp 2', 'Lớp 3', 'Lớp 4', 'Lớp 5'],
  'Cấp 2': ['Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9'],
  'Cấp 3': ['Lớp 10', 'Lớp 11', 'Lớp 12'],
}

// --- COMPONENTS CON CHO FORM ---

const FormulaInput = ({ formula, index, onChange, onRemove }) => {
  return (
    <div className='sub-item-box'>
      <div className='sub-item-header'>
        <span>Công thức #{index + 1}</span>
        <button type='button' className='btn-icon-danger' onClick={onRemove}>
          <Trash2 size={14} />
        </button>
      </div>
      <div className='form-group'>
        <input
          type='text'
          placeholder='Nhập mã LaTeX (vd: \frac{a}{b})'
          value={formula.formulaText}
          onChange={(e) => onChange('formulaText', e.target.value)}
        />
      </div>
      {/* Preview KaTeX */}
      {formula.formulaText && (
        <div className='katex-preview'>
          <span className='preview-label'>Preview:</span>
          <div className='math-display'>
            <InlineMath math={formula.formulaText} />
          </div>
        </div>
      )}
      <div className='form-group'>
        <input
          type='text'
          placeholder='Giải thích'
          value={formula.explanation}
          onChange={(e) => onChange('explanation', e.target.value)}
        />
      </div>
    </div>
  )
}

// Component Form Tạo Mới
const CreateCurriculumForm = ({ onClose, onSuccess }) => {
  // State lưu dữ liệu form
  const [topic, setTopic] = useState({
    topicName: '',
    className: 'Lớp 1',
    gradeName: 'Cấp 1',
    strandName: '',
    objectives: '',
    source: '',
    contents: [],
  })

  // Lấy danh sách lớp dựa trên cấp hiện tại
  const currentClasses = GRADE_CLASS_MAPPING[topic.gradeName] || []

  // Tự động reset lớp về giá trị đầu tiên khi đổi cấp
  useEffect(() => {
    const firstClassOfGrade = GRADE_CLASS_MAPPING[topic.gradeName]?.[0]
    if (firstClassOfGrade) {
      setTopic((prev) => ({ ...prev, className: firstClassOfGrade }))
    }
  }, [topic.gradeName])

  const handleTopicChange = (field, value) => {
    setTopic((prev) => ({ ...prev, [field]: value }))
  }

  // --- Content Handling (Immutable Updates) ---
  const addContent = () => {
    setTopic((prev) => ({
      ...prev,
      contents: [
        ...prev.contents,
        { title: '', summary: '', formulas: [], examples: [], media: [] },
      ],
    }))
  }

  const removeContent = (idx) => {
    setTopic((prev) => ({
      ...prev,
      contents: prev.contents.filter((_, i) => i !== idx),
    }))
  }

  const handleContentChange = (idx, field, value) => {
    setTopic((prev) => {
      const newContents = [...prev.contents]
      newContents[idx] = { ...newContents[idx], [field]: value }
      return { ...prev, contents: newContents }
    })
  }

  // --- Nested Array Handling (Formulas, Examples, Media) ---
  const addItemToContent = (contentIdx, arrayName, itemTemplate) => {
    setTopic((prev) => {
      const newContents = [...prev.contents]
      const targetContent = { ...newContents[contentIdx] }
      targetContent[arrayName] = [...targetContent[arrayName], itemTemplate]
      newContents[contentIdx] = targetContent
      return { ...prev, contents: newContents }
    })
  }

  const removeItemFromContent = (contentIdx, arrayName, itemIdx) => {
    setTopic((prev) => {
      const newContents = [...prev.contents]
      const targetContent = { ...newContents[contentIdx] }
      targetContent[arrayName] = targetContent[arrayName].filter(
        (_, i) => i !== itemIdx
      )
      newContents[contentIdx] = targetContent
      return { ...prev, contents: newContents }
    })
  }

  const handleItemChange = (contentIdx, arrayName, itemIdx, field, value) => {
    setTopic((prev) => {
      const newContents = [...prev.contents]
      const targetContent = { ...newContents[contentIdx] }
      const targetArray = [...targetContent[arrayName]]

      targetArray[itemIdx] = { ...targetArray[itemIdx], [field]: value }
      targetContent[arrayName] = targetArray
      newContents[contentIdx] = targetContent

      return { ...prev, contents: newContents }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = { topics: [topic] }
      console.log('Submitting:', payload)
      await createTemplate(payload) // Vẫn dùng API import cũ
      alert('Thêm chương trình học thành công!')
      onSuccess()
    } catch (error) {
      console.error(error)
      alert('Lỗi khi tạo: ' + (error.response?.data?.message || error.message))
    }
  }

  return (
    <div className='modal-overlay'>
      <div className='modal-content large-modal'>
        <div className='modal-header'>
          <h2>Thêm Chủ Đề Mới</h2>
          <button className='close-btn' onClick={onClose}>
            ×
          </button>
        </div>
        <div className='modal-body scrollable'>
          <form onSubmit={handleSubmit}>
            {/* Topic Info */}
            <div className='form-row'>
              <div className='form-group'>
                <label>
                  Tên Chủ Đề <span className='text-danger'>*</span>
                </label>
                <input
                  required
                  type='text'
                  value={topic.topicName}
                  onChange={(e) =>
                    handleTopicChange('topicName', e.target.value)
                  }
                />
              </div>
              <div className='form-group'>
                <label>Cấp Học</label>
                <select
                  value={topic.gradeName}
                  onChange={(e) =>
                    handleTopicChange('gradeName', e.target.value)
                  }
                >
                  {Object.keys(GRADE_CLASS_MAPPING).map((grade) => (
                    <option key={grade} value={grade}>
                      {grade}
                    </option>
                  ))}
                </select>
              </div>
              <div className='form-group'>
                <label>Lớp</label>
                <select
                  value={topic.className}
                  onChange={(e) =>
                    handleTopicChange('className', e.target.value)
                  }
                >
                  {currentClasses.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className='form-row'>
              <div className='form-group'>
                <label>Mạch Kiến Thức</label>
                <select
                  value={topic.strandName}
                  onChange={(e) =>
                    handleTopicChange('strandName', e.target.value)
                  }
                >
                  <option value=''>-- Chọn mạch --</option>
                  <option value='Số, Đại số và Giải tích'>
                    Số, Đại số và Giải tích
                  </option>
                  <option value='Đo lường và Hình học'>
                    Đo lường và Hình học
                  </option>
                  <option value='Số liệu và Xác suất'>
                    Số liệu và Xác suất
                  </option>
                  <option value='Hình học và Đo lường'>
                    Hình học và Đo lường
                  </option>
                  <option value='Số và Đại số'>Số và Đại số</option>
                  <option value='Đại số và Giải tích'>
                    Đại số và Giải tích
                  </option>
                </select>
              </div>
              <div className='form-group'>
                <label>Nguồn (Source)</label>
                <input
                  type='text'
                  value={topic.source}
                  onChange={(e) => handleTopicChange('source', e.target.value)}
                />
              </div>
            </div>
            <div className='form-group'>
              <label>Mục tiêu (Objectives)</label>
              <textarea
                rows='2'
                value={topic.objectives}
                onChange={(e) =>
                  handleTopicChange('objectives', e.target.value)
                }
              />
            </div>

            <hr />

            {/* Contents List */}
            <div className='contents-section'>
              <div className='section-header'>
                <h3>Nội dung chi tiết</h3>
                <button type='button' className='btn-add' onClick={addContent}>
                  <Plus size={16} /> Thêm Nội Dung
                </button>
              </div>

              {topic.contents.length === 0 && (
                <p className='text-muted text-center'>
                  Chưa có nội dung nào. Bấm "Thêm Nội Dung" để bắt đầu.
                </p>
              )}

              {topic.contents.map((content, cIdx) => (
                <div key={cIdx} className='content-card'>
                  <div className='content-header'>
                    <span>Nội dung #{cIdx + 1}</span>
                    <button
                      type='button'
                      className='btn-icon-danger'
                      onClick={() => removeContent(cIdx)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className='form-group'>
                    <input
                      type='text'
                      placeholder='Tiêu đề nội dung (vd: Định nghĩa...)'
                      value={content.title}
                      onChange={(e) =>
                        handleContentChange(cIdx, 'title', e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className='form-group'>
                    <textarea
                      placeholder='Tóm tắt nội dung'
                      rows='2'
                      value={content.summary}
                      onChange={(e) =>
                        handleContentChange(cIdx, 'summary', e.target.value)
                      }
                    />
                  </div>

                  {/* Formulas */}
                  <div className='sub-section'>
                    <div className='sub-header'>
                      <label>Công thức</label>
                      <button
                        type='button'
                        className='btn-small'
                        onClick={() =>
                          addItemToContent(cIdx, 'formulas', {
                            formulaText: '',
                            explanation: '',
                          })
                        }
                      >
                        + Thêm
                      </button>
                    </div>
                    {content.formulas.map((f, fIdx) => (
                      <FormulaInput
                        key={fIdx}
                        formula={f}
                        index={fIdx}
                        onChange={(field, val) =>
                          handleItemChange(cIdx, 'formulas', fIdx, field, val)
                        }
                        onRemove={() =>
                          removeItemFromContent(cIdx, 'formulas', fIdx)
                        }
                      />
                    ))}
                  </div>

                  {/* Examples */}
                  <div className='sub-section'>
                    <div className='sub-header'>
                      <label>Ví dụ</label>
                      <button
                        type='button'
                        className='btn-small'
                        onClick={() =>
                          addItemToContent(cIdx, 'examples', {
                            exampleText: '',
                          })
                        }
                      >
                        + Thêm
                      </button>
                    </div>
                    {content.examples.map((ex, exIdx) => (
                      <div key={exIdx} className='sub-item-box flex-row'>
                        <input
                          type='text'
                          className='flex-grow'
                          placeholder='Nội dung ví dụ'
                          value={ex.exampleText}
                          onChange={(e) =>
                            handleItemChange(
                              cIdx,
                              'examples',
                              exIdx,
                              'exampleText',
                              e.target.value
                            )
                          }
                        />
                        <button
                          type='button'
                          className='btn-icon-danger ml-2'
                          onClick={() =>
                            removeItemFromContent(cIdx, 'examples', exIdx)
                          }
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Media */}
                  <div className='sub-section'>
                    <div className='sub-header'>
                      <label>Media</label>
                      <button
                        type='button'
                        className='btn-small'
                        onClick={() =>
                          addItemToContent(cIdx, 'media', {
                            type: 'Image',
                            url: '',
                            description: '',
                          })
                        }
                      >
                        + Thêm
                      </button>
                    </div>
                    {content.media.map((m, mIdx) => (
                      <div key={mIdx} className='sub-item-box'>
                        <div className='sub-item-header'>
                          <span>Media #{mIdx + 1}</span>
                          <button
                            type='button'
                            className='btn-icon-danger'
                            onClick={() =>
                              removeItemFromContent(cIdx, 'media', mIdx)
                            }
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <div className='form-group'>
                          <select
                            value={m.type}
                            onChange={(e) =>
                              handleItemChange(
                                cIdx,
                                'media',
                                mIdx,
                                'type',
                                e.target.value
                              )
                            }
                          >
                            <option value='Image'>Hình ảnh</option>
                            <option value='Video'>Video</option>
                          </select>
                        </div>
                        <div className='form-group'>
                          <input
                            type='text'
                            placeholder='URL (https://...)'
                            value={m.url}
                            onChange={(e) =>
                              handleItemChange(
                                cIdx,
                                'media',
                                mIdx,
                                'url',
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className='form-group'>
                          <input
                            type='text'
                            placeholder='Mô tả ngắn'
                            value={m.description}
                            onChange={(e) =>
                              handleItemChange(
                                cIdx,
                                'media',
                                mIdx,
                                'description',
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className='form-actions'>
              <button type='button' className='btn-cancel' onClick={onClose}>
                Hủy
              </button>
              <button type='submit' className='btn-save'>
                Lưu
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// --- MAIN PAGE COMPONENT ---
const CurriculumManagementPage = () => {
  const [filter, setFilter] = useState({
    grade: 'Cấp 1',
    class: 'Lớp 4',
    isActive: 'true',
  })
  const [curriculums, setCurriculums] = useState([])
  const [loading, setLoading] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [expandedRows, setExpandedRows] = useState({})
  const [showCheatSheet, setShowCheatSheet] = useState(false)

  const filterClasses = GRADE_CLASS_MAPPING[filter.grade] || []

  useEffect(() => {
    const firstClass = GRADE_CLASS_MAPPING[filter.grade]?.[0]
    if (firstClass) {
      setFilter((prev) => ({ ...prev, class: firstClass }))
    }
  }, [filter.grade])

  const fetchCurriculum = () => {
    if (!filter.grade || !filter.class) return

    setLoading(true)
    let activeParam = null
    if (filter.isActive === 'true') activeParam = true
    if (filter.isActive === 'false') activeParam = false

    getCurriculum(filter.grade, filter.class, activeParam)
      .then((res) => {
        setCurriculums(res.data)
      })
      .catch((err) => {
        console.error('Fetch error:', err)
        setCurriculums([])
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchCurriculum()
  }, [filter.grade, filter.class, filter.isActive])

  const toggleRow = (id) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const handleDelete = async (e, topicId) => {
    e.stopPropagation()
    if (window.confirm('Bạn có chắc chắn muốn xóa chủ đề này không?')) {
      try {
        await deleteTopic(topicId)
        alert('Đã xóa thành công!')
        fetchCurriculum()
      } catch (error) {
        console.error(error)
        alert(
          'Xóa thất bại: ' + (error.response?.data?.message || error.message)
        )
      }
    }
  }

  return (
    <div className='admin-curriculum-page'>
      <div className='page-header'>
        <h1 className='admin-page-title'>Quản lý Chương Trình Học</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          {/* Nút bật Cheat Sheet */}
          <button
            className='btn-secondary'
            onClick={() => setShowCheatSheet(!showCheatSheet)}
            title='Bảng công thức Toán'
            style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <HelpCircle size={18} /> Công thức
          </button>

          <button
            className='btn-primary'
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus size={18} /> Thêm Chủ Đề Mới
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className='filter-bar'>
        <div className='filter-item'>
          <label>Cấp học:</label>
          <select
            value={filter.grade}
            onChange={(e) =>
              setFilter((prev) => ({ ...prev, grade: e.target.value }))
            }
          >
            {Object.keys(GRADE_CLASS_MAPPING).map((grade) => (
              <option key={grade} value={grade}>
                {grade}
              </option>
            ))}
          </select>
        </div>
        <div className='filter-item'>
          <label>Lớp:</label>
          <select
            value={filter.class}
            onChange={(e) =>
              setFilter((prev) => ({ ...prev, class: e.target.value }))
            }
          >
            {filterClasses.map((cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className='table-container'>
        {loading ? (
          <p style={{ padding: '2rem', textAlign: 'center' }}>
            ⏳ Đang tải dữ liệu...
          </p>
        ) : (
          <table className='admin-table'>
            <thead>
              <tr>
                <th style={{ width: '40px' }}></th>
                <th>ID</th>
                <th>Chủ đề (Topic)</th>
                <th>Lớp</th>
                <th>Mạch kiến thức</th>
                <th>Trạng thái</th> {/* Cột mới */}
                <th>Hành động</th> {/* Cột mới */}
              </tr>
            </thead>
            <tbody>
              {curriculums.length === 0 ? (
                <tr>
                  <td
                    colSpan='6'
                    style={{ textAlign: 'center', padding: '2rem' }}
                  >
                    Không tìm thấy dữ liệu cho{' '}
                    <strong>
                      {filter.grade} - {filter.class}
                    </strong>
                    .
                  </td>
                </tr>
              ) : (
                curriculums.map((item) => (
                  <>
                    <tr
                      key={item.topicID}
                      className={`topic-row ${
                        !item.isActive ? 'row-disabled' : ''
                      }`}
                      onClick={() => toggleRow(item.topicID)}
                    >
                      <td className='toggle-cell'>
                        {expandedRows[item.topicID] ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        )}
                      </td>
                      <td>{item.topicID}</td>
                      <td className='fw-bold'>{item.topicName}</td>
                      <td>{item.className}</td>
                      <td>{item.strandName}</td>

                      {/* Hiển thị Trạng thái */}
                      <td>
                        <span
                          className={`status-badge ${
                            item.isActive ? 'active' : 'inactive'
                          }`}
                        >
                          {item.isActive ? 'Hoạt động' : 'Đã xóa'}
                        </span>
                      </td>

                      {/* Hiển thị nút Xóa */}
                      <td>
                        {item.isActive && (
                          <button
                            className='btn-icon-danger'
                            title='Xóa chủ đề này'
                            onClick={(e) => handleDelete(e, item.topicID)}
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </td>
                    </tr>

                    {/* Expanded Detail Row */}
                    {expandedRows[item.topicID] && (
                      <tr className='detail-row'>
                        <td colSpan='7'>
                          <div className='detail-content'>
                            <p>
                              <strong>🎯 Mục tiêu:</strong> {item.objectives}
                            </p>
                            <p
                              className='text-muted'
                              style={{ fontSize: '0.9em' }}
                            >
                              <strong>Nguồn:</strong> {item.source}
                            </p>

                            <h4 style={{ marginTop: '1rem' }}>
                              Nội dung chi tiết ({item.contents.length}):
                            </h4>
                            <div className='contents-grid'>
                              {item.contents.map((c) => (
                                <div key={c.contentID} className='detail-card'>
                                  <h5>{c.title}</h5>
                                  <p className='summary'>{c.summary}</p>

                                  {/* Formulas */}
                                  {c.formulas.length > 0 && (
                                    <div className='formulas-list'>
                                      <strong>Công thức:</strong>
                                      <ul>
                                        {c.formulas.map((f) => (
                                          <li
                                            key={f.formulaID}
                                            style={{ marginBottom: '0.5rem' }}
                                          >
                                            <InlineMath math={f.formulaText} />
                                            {f.explanation && (
                                              <span
                                                className='text-muted'
                                                style={{
                                                  fontSize: '0.9em',
                                                  marginLeft: '5px',
                                                }}
                                              >
                                                ({f.explanation})
                                              </span>
                                            )}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  {/* Examples */}
                                  {c.examples.length > 0 && (
                                    <div
                                      className='examples-list'
                                      style={{ marginTop: '0.5rem' }}
                                    >
                                      <strong>Ví dụ:</strong>
                                      <ul
                                        style={{
                                          paddingLeft: '1.2rem',
                                          margin: 0,
                                        }}
                                      >
                                        {c.examples.map((ex) => (
                                          <li key={ex.exampleID}>
                                            {ex.exampleText}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  {/* Media Preview */}
                                  {c.media.length > 0 && (
                                    <div
                                      style={{
                                        marginTop: '0.5rem',
                                        fontSize: '0.85rem',
                                      }}
                                    >
                                      <strong>Media:</strong> {c.media.length}{' '}
                                      tệp đính kèm
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {isCreateModalOpen && (
        <CreateCurriculumForm
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={() => {
            setIsCreateModalOpen(false)
            fetchCurriculum() // Refresh list
          }}
        />
      )}
      {showCheatSheet && (
        <KaTeXCheatSheet onClose={() => setShowCheatSheet(false)} />
      )}
    </div>
  )
}

export default CurriculumManagementPage
