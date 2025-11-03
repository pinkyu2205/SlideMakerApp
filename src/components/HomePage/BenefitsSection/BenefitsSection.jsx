import { CheckCircle } from 'lucide-react'
import './BenefitsSection.css'

const BenefitsSection = () => {
  const benefits = [
    {
      title: 'Tiết kiệm thời gian',
      description: 'Giảm đáng kể thời gian chuẩn bị bài giảng cho giáo viên',
    },
    {
      title: 'Nội dung chính xác',
      description: 'Đảm bảo nội dung đúng với chương trình GDPT',
    },
    {
      title: 'Dễ dàng chia sẻ',
      description: 'Xuất file PDF/PPTX và chia sẻ với học sinh',
    },
    {
      title: 'Hỗ trợ công thức',
      description: 'Render công thức Toán học chuyên nghiệp với KaTeX',
    },
  ]

  return (
    <section className='benefits-section'>
      <div className='benefits-container'>
        <h2 className='benefits-title'>Lợi ích khi sử dụng MathSlides</h2>
        <div className='benefits-grid'>
          {benefits.map((benefit, index) => (
            <div key={index} className='benefit-item'>
              <CheckCircle className='benefit-icon' />
              <div className='benefit-content'>
                <h3 className='benefit-title'>{benefit.title}</h3>
                <p className='benefit-description'>{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BenefitsSection
