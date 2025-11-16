import { useState } from 'react'
import { getCurriculum } from '../../services/api'
import './OptionsTemplatePage.css'

const OptionsTemplatePage = () => {
  const [selectedGrade, setSelectedGrade] = useState(null)
  const [selectedClass, setSelectedClass] = useState(null)
  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [expandedTopicId, setExpandedTopicId] = useState(null)

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

  const handleGradeSelect = (gradeKey) => {
    console.log('Selected grade:', gradeKey)
    setSelectedGrade(gradeKey)
    setSelectedClass(null)
    setTopics([])
    setError(null)
  }

  const handleClassSelect = async (className) => {
    console.log('Selected class:', className, 'Grade:', selectedGrade)
    setSelectedClass(className)
    setExpandedTopicId(null)
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
        setTopics(response.data)
        if (response.data.length === 0) {
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
  }

  const toggleTopicExpand = (topicId) => {
    if (expandedTopicId === topicId) {
      setExpandedTopicId(null)
    } else {
      setExpandedTopicId(topicId)
    }
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
        </div>

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

            {!loading && !error && topics.length > 0 && (
              <div className='topics-list'>
                {topics.map((topic) => (
                  <div key={topic.topicID} className='topic-card'>
                    {/* Topic Header - Click to expand */}
                    <div 
                      className={`topic-card-header ${expandedTopicId === topic.topicID ? 'expanded' : ''}`}
                      onClick={() => toggleTopicExpand(topic.topicID)}
                    >
                      <div className='topic-header-content'>
                        <h3 className='topic-name'>{topic.topicName}</h3>
                        <p className='topic-strand'>{topic.strandName}</p>
                      </div>
                      <div className='topic-expand-icon'>
                        {expandedTopicId === topic.topicID ? '▼' : '▶'}
                      </div>
                    </div>

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
                  </div>
                ))}
              </div>
            )}

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
      </div>
    </div>
  )
}

export default OptionsTemplatePage
