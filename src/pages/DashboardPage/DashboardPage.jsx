import { useState } from 'react'
import './DashboardPage.css'
// import { getGradesAndClasses, getCurriculum } from '../../services/api'; // Sẽ dùng khi có API

const DashboardPage = () => {
  // Dữ liệu giả định, sẽ thay thế bằng API call
  const mockGrades = [
    { gradeID: 1, name: 'Cấp 1', classes: [{ classID: 1, name: 'Lớp 5' }] },
    { gradeID: 2, name: 'Cấp 2', classes: [{ classID: 2, name: 'Lớp 6' }] },
  ]
  const mockTopics = [
    { topicID: 1, topicName: 'Phân số' },
    { topicID: 2, topicName: 'Số thập phân' },
  ]
  const mockPreviewContent = {
    title: 'Khái niệm phân số',
    summary: 'Phân số là biểu diễn của một phần trong tổng thể.',
    formulas: ['\\frac{a}{b}'],
    examples: ['Ví dụ: \\frac{1}{2} là một nửa'],
  }

  const [grades, setGrades] = useState(mockGrades)
  const [selectedGrade, setSelectedGrade] = useState('')
  const [classes, setClasses] = useState([])
  const [selectedClass, setSelectedClass] = useState('')
  const [topics, setTopics] = useState([])
  const [selectedTopic, setSelectedTopic] = useState('')
  const [previewContent, setPreviewContent] = useState(null)

  // TODO: Thay thế bằng API thật
  // useEffect(() => {
  //   getGradesAndClasses().then(response => {
  //     setGrades(response.data);
  //   });
  // }, []);

  const handleGradeChange = (e) => {
    const gradeId = e.target.value
    setSelectedGrade(gradeId)
    const selectedGradeData = grades.find(
      (g) => g.gradeID.toString() === gradeId
    )
    setClasses(selectedGradeData ? selectedGradeData.classes : [])
    setSelectedClass('')
    setTopics([])
    setSelectedTopic('')
  }

  const handleClassChange = (e) => {
    const classId = e.target.value
    setSelectedClass(classId)
    // TODO: Fetch topics for the selected class
    setTopics(mockTopics)
  }

  const handleTopicChange = (e) => {
    const topicId = e.target.value
    setSelectedTopic(topicId)
    // TODO: Fetch content for the selected topic
    setPreviewContent(mockPreviewContent)
  }

  return (
    <div className='dashboard-container'>
      <h1 className='dashboard-title'>Chọn Chủ Đề Bài Giảng</h1>

      <div className='filters-container'>
        <div className='filter-group'>
          <label htmlFor='grade-select'>Cấp học</label>
          <select
            id='grade-select'
            value={selectedGrade}
            onChange={handleGradeChange}
          >
            <option value=''>-- Chọn cấp học --</option>
            {grades.map((grade) => (
              <option key={grade.gradeID} value={grade.gradeID}>
                {grade.name}
              </option>
            ))}
          </select>
        </div>

        <div className='filter-group'>
          <label htmlFor='class-select'>Lớp</label>
          <select
            id='class-select'
            value={selectedClass}
            onChange={handleClassChange}
            disabled={!selectedGrade}
          >
            <option value=''>-- Chọn lớp --</option>
            {classes.map((cls) => (
              <option key={cls.classID} value={cls.classID}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>

        <div className='filter-group'>
          <label htmlFor='topic-select'>Chủ đề</label>
          <select
            id='topic-select'
            value={selectedTopic}
            onChange={handleTopicChange}
            disabled={!selectedClass}
          >
            <option value=''>-- Chọn chủ đề --</option>
            {topics.map((topic) => (
              <option key={topic.topicID} value={topic.topicID}>
                {topic.topicName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {previewContent && (
        <div className='preview-section'>
          <h2 className='preview-title'>Xem trước nội dung</h2>
          <div className='preview-card'>
            <h3>{previewContent.title}</h3>
            <p>
              <strong>Tóm tắt:</strong> {previewContent.summary}
            </p>
            <div className='preview-subsection'>
              <h4>Công thức chính:</h4>
              {previewContent.formulas.map((formula, index) => (
                <div key={index} className='formula'>
                  {formula}
                </div>
              ))}
            </div>
            <div className='preview-subsection'>
              <h4>Ví dụ:</h4>
              {previewContent.examples.map((example, index) => (
                <p key={index}>{example}</p>
              ))}
            </div>
          </div>
          <button className='create-slide-btn'>Tạo Slide từ chủ đề này</button>
        </div>
      )}
    </div>
  )
}

export default DashboardPage
