import { useState, useEffect } from 'react'
import { getCurriculum, getAllTopics, updateTopic, deactivateTopic } from '../../services/api'
import './OptionsTemplatePage.css'

const OptionsTemplatePage = () => {
  const [selectedGrade, setSelectedGrade] = useState(null)
  const [selectedClass, setSelectedClass] = useState(null)
  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [expandedTopicId, setExpandedTopicId] = useState(null)
  const [user, setUser] = useState(null)
  const [showAllTopics, setShowAllTopics] = useState(false)
  const [editingTopicId, setEditingTopicId] = useState(null)
  const [editingTopicData, setEditingTopicData] = useState({})
  const [adminTopics, setAdminTopics] = useState([])

  // Định nghĩa cấp học và lớp tương ứng
  const gradeOptions = {
    grade1: {
      name: 'Cấp 1',
      description: 'Lớp 1 - Lớp 5',
      classes: ['Lớp 1', 'Lớp 2', 'Lớp 3', 'Lớp 4', 'Lớp 5'],
      gradeValue: 'Cấp 1'
    },
    grade2: {
      name: 'Cấp 2',
      description: 'Lớp 6 - Lớp 9',
      classes: ['Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9'],
      gradeValue: 'Cấp 2'
    },
    grade3: {
      name: 'Cấp 3',
      description: 'Lớp 10 - Lớp 12',
      classes: ['Lớp 10', 'Lớp 11', 'Lớp 12'],
      gradeValue: 'Cấp 3'
    }
  }

  useEffect(() => {
    // Load user data from localStorage
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        setUser(userData)
        console.log('🔍 User data loaded:', userData)
      } catch (error) {
        console.error('Error parsing user data:', error)
      }
    }
  }, [])

  // Check if user is admin
  const isAdmin = user && (
    user.roleID === 1 || 
    user.roleId === 1 || 
    user.role === 'Admin' || 
    user.role === 'admin'
  )

  // Fetch all topics for admin
  const fetchAllTopics = async () => {
    try {
      setLoading(true)
      console.log('📚 Fetching all topics for admin...')
      const response = await getAllTopics()
      console.log('✅ All topics:', response.data)
      setAdminTopics(response.data || [])
      setShowAllTopics(true)
      setError(null)
    } catch (err) {
      console.error('❌ Error fetching all topics:', err)
      setError('Không thể tải danh sách topics')
    } finally {
      setLoading(false)
    }
  }

  const handleEditTopic = (topic) => {
    setEditingTopicId(topic.topicID)
    setEditingTopicData({ ...topic })
  }

  const handleSaveEditTopic = async (topicId) => {
    try {
      setLoading(true)
      console.log('💾 Saving topic:', editingTopicData)
      await updateTopic(topicId, editingTopicData)
      console.log('✅ Topic updated successfully')
      
      // Update local state
      setAdminTopics(adminTopics.map(t => 
        t.topicID === topicId ? editingTopicData : t
      ))
      setEditingTopicId(null)
      setEditingTopicData({})
    } catch (err) {
      console.error('❌ Error updating topic:', err)
      setError('Không thể cập nhật topic')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTopic = async (topicId) => {
    if (window.confirm('Bạn có chắc muốn ẩn topic này?')) {
      try {
        setLoading(true)
        console.log('🗑️ Deactivating topic:', topicId)
        await deactivateTopic(topicId)
        console.log('✅ Topic deactivated successfully')
        
        // Update local state
        setAdminTopics(adminTopics.map(t => 
          t.topicID === topicId ? { ...t, isActive: false } : t
        ))
      } catch (err) {
        console.error('❌ Error deleting topic:', err)
        setError('Không thể xoá topic')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleCancelEdit = () => {
    setEditingTopicId(null)
    setEditingTopicData({})
  }

  const handleGradeSelect = (gradeKey) => {
    console.log('Selected grade:', gradeKey)
    setSelectedGrade(gradeKey)
    setSelectedClass(null)
    setTopics([])
    setError(null)
    setShowAllTopics(false)
  }

  const handleClassSelect = async (className) => {
    console.log('Selected class:', className, 'Grade:', selectedGrade)
    setSelectedClass(className)
    setExpandedTopicId(null)
    setShowAllTopics(false)
    await fetchTopics(className, selectedGrade)
  }

  const fetchTopics = async (className, gradeKey) => {
    if (!gradeKey) {
      console.error('No gradeKey provided')
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const gradeName = gradeOptions[gradeKey].gradeValue
      console.log('🔍 Fetching curriculum for:', { gradeName, className })
      
      const response = await getCurriculum(gradeName, className)
      console.log('✅ API Response:', response)
      
      if (response.data && Array.isArray(response.data)) {
        console.log('📚 Topics loaded:', response.data)
        // Filter topics by isActive status for non-admin users
        const filteredTopics = isAdmin ? response.data : response.data.filter(t => t.isActive !== false)
        setTopics(filteredTopics)
        if (filteredTopics.length === 0) {
          setError('Chưa có chương trình học cho lớp này')
        }
      } else {
        console.log('❌ Response data is not an array:', response.data)
        setTopics([])
        setError('Dữ liệu không hợp lệ. Vui lòng thử lại.')
      }
    } catch (err) {
      console.error('❌ Lỗi khi tải chương trình:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      })
      
      let errorMessage = 'Không thể tải chương trình học'
      if (err.message.includes('CORS')) {
        errorMessage = 'Lỗi CORS: Backend cần cấu hình CORS headers. Liên hệ admin backend.'
      } else if (err.response?.status === 404) {
        errorMessage = 'Không tìm thấy dữ liệu cho lớp này'
      } else if (err.response?.status === 500) {
        errorMessage = 'Lỗi server. Vui lòng thử lại sau.'
      } else if (err.message.includes('Network')) {
        errorMessage = 'Lỗi kết nối. Kiểm tra URL backend: https://localhost:7259'
      }
      
      setError(errorMessage)
      setTopics([])
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setSelectedGrade(null)
    setSelectedClass(null)
    setTopics([])
    setError(null)
    setExpandedTopicId(null)
    setShowAllTopics(false)
  }

  const toggleTopicExpand = (topicId) => {
    if (expandedTopicId === topicId) {
      setExpandedTopicId(null)
    } else {
      setExpandedTopicId(topicId)
    }
  }

  // Render topics list (for both regular view and admin view)
  const renderTopicsList = (topicsList) => {
    return (
      <div className='topics-list'>
        {topicsList.map((topic) => (
          <div key={topic.topicID} className={`topic-card ${!topic.isActive ? 'inactive' : ''}`}>
            {/* Admin Edit Mode */}
            {editingTopicId === topic.topicID && isAdmin ? (
              <div className='topic-edit-form'>
                <input
                  type='text'
                  value={editingTopicData.topicName || ''}
                  onChange={(e) => setEditingTopicData({ ...editingTopicData, topicName: e.target.value })}
                  placeholder='Tên chủ đề'
                  className='form-input'
                />
                <input
                  type='text'
                  value={editingTopicData.strandName || ''}
                  onChange={(e) => setEditingTopicData({ ...editingTopicData, strandName: e.target.value })}
                  placeholder='Lĩnh vực'
                  className='form-input'
                />
                <div className='form-checkbox'>
                  <label>
                    <input
                      type='checkbox'
                      checked={editingTopicData.isActive !== false}
                      onChange={(e) => setEditingTopicData({ ...editingTopicData, isActive: e.target.checked })}
                    />
                    Hoạt động (Active)
                  </label>
                </div>
                <div className='form-buttons'>
                  <button 
                    className='btn btn-primary'
                    onClick={() => handleSaveEditTopic(topic.topicID)}
                  >
                    💾 Lưu
                  </button>
                  <button 
                    className='btn btn-secondary'
                    onClick={handleCancelEdit}
                  >
                    ❌ Huỷ
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Topic Header - Click to expand */}
                <div 
                  className={`topic-card-header ${expandedTopicId === topic.topicID ? 'expanded' : ''}`}
                  onClick={() => toggleTopicExpand(topic.topicID)}
                >
                  <div className='topic-header-content'>
                    <h3 className='topic-name'>
                      {topic.topicName}
                      {!topic.isActive && <span className='badge-inactive'>[Ẩn]</span>}
                    </h3>
                    <p className='topic-strand'>{topic.strandName}</p>
                  </div>
                  <div className='topic-expand-icon'>
                    {expandedTopicId === topic.topicID ? '▼' : '▶'}
                  </div>
                </div>

                {/* Admin Action Buttons */}
                {isAdmin && (
                  <div className='topic-admin-actions'>
                    <button 
                      className='btn-admin btn-edit'
                      onClick={() => handleEditTopic(topic)}
                      title='Chỉnh sửa topic'
                    >
                      ✏️ Sửa
                    </button>
                    <button 
                      className='btn-admin btn-delete'
                      onClick={() => handleDeleteTopic(topic.topicID)}
                      title='Ẩn topic'
                    >
                      🗑️ Ẩn
                    </button>
                  </div>
                )}

                {/* Contents - Show when expanded */}
                {expandedTopicId === topic.topicID && (
                  <div className='topic-contents'>
                    {topic.contents && topic.contents.length > 0 ? (
                      <div className='contents-list'>
                        {topic.contents.map((content) => (
                          <div key={content.contentID} className='content-item'>
                            <div className='content-info'>
                              <h4 className='content-title'>{content.title}</h4>
                              <p className='content-summary'>{content.summary}</p>
                            </div>
                            <button className='create-slide-btn'>
                              ✏️ Tạo Slide
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className='no-contents'>Chủ đề này không có nội dung</p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className='options-template-container'>
      <div className='options-template-wrapper'>
        {/* Header Section */}
        <div className='options-template-header'>
          <h1 className='options-template-title'>Chọn Chương Trình Học</h1>
          <p className='options-template-subtitle'>
            Vui lòng chọn cấp học và lớp học để xem các chủ đề
          </p>
          
          {/* Admin View All Topics Button */}
          {isAdmin && !showAllTopics && (
            <button 
              className='btn btn-admin-all'
              onClick={fetchAllTopics}
            >
              👑 Xem Tất Cả Topics (Admin)
            </button>
          )}
        </div>

        {/* Admin Topics View */}
        {isAdmin && showAllTopics && (
          <div className='admin-all-topics-section'>
            <div className='admin-topics-header'>
              <h2>📋 Tất Cả Topics (Quản Lý)</h2>
              <button 
                className='btn btn-secondary'
                onClick={() => setShowAllTopics(false)}
              >
                ← Quay Lại
              </button>
            </div>

            {loading && (
              <div className='loading-message'>⏳ Đang tải...</div>
            )}

            {error && (
              <div className='error-message'>⚠️ {error}</div>
            )}

            {!loading && adminTopics.length > 0 && renderTopicsList(adminTopics)}
            {!loading && adminTopics.length === 0 && (
              <div className='no-topics'>📭 Không có topics nào</div>
            )}
          </div>
        )}

        {/* Regular User View */}
        {!showAllTopics && (
          <>
            {/* Grade Selection Section */}
            <div className='grade-section'>
              <h2 className='section-title'>Chọn Cấp</h2>
              <div className='grade-cards'>
                {Object.entries(gradeOptions).map(([gradeKey, gradeData]) => (
                  <div
                    key={gradeKey}
                    className={`grade-card ${selectedGrade === gradeKey ? 'active' : ''}`}
                    onClick={() => handleGradeSelect(gradeKey)}
                  >
                    <div className='grade-card-content'>
                      <h3 className='grade-name'>{gradeData.name}</h3>
                      <p className='grade-description'>{gradeData.description}</p>
                    </div>
                    <div className={`grade-checkbox ${selectedGrade === gradeKey ? 'checked' : ''}`}>
                      {selectedGrade === gradeKey && <span className='checkmark'>✓</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Class Selection Section */}
            {selectedGrade && (
              <div className='class-section'>
                <h2 className='section-title'>Chọn Lớp</h2>
                <div className='class-buttons'>
                  {gradeOptions[selectedGrade].classes.map((className) => (
                    <button
                      key={className}
                      className={`class-button ${selectedClass === className ? 'active' : ''}`}
                      onClick={() => handleClassSelect(className)}
                    >
                      {className}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Topics Section */}
            {selectedClass && (
              <div className='topics-section'>
                <h2 className='section-title'>Chủ Đề Học Tập</h2>
                
                {loading && (
                  <div className='loading-message'>⏳ Đang tải chương trình học...</div>
                )}

                {error && (
                  <div className='error-message'>⚠️ {error}</div>
                )}

                {!loading && !error && topics.length > 0 && renderTopicsList(topics)}

                {!loading && !error && topics.length === 0 && (
                  <div className='no-topics'>
                    📭 Chưa có chủ đề nào cho lớp này
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            {(selectedGrade || selectedClass) && (
              <div className='action-buttons'>
                <button
                  className='btn btn-secondary'
                  onClick={handleReset}
                >
                  🔄 Đặt Lại
                </button>
              </div>
            )}

            {/* Summary */}
            {selectedGrade && selectedClass && (
              <div className='selection-summary'>
                <p>
                  Bạn đã chọn: <strong>{gradeOptions[selectedGrade].name}</strong> - <strong>{selectedClass}</strong>
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default OptionsTemplatePage
