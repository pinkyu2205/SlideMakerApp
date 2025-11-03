import { useNavigate } from 'react-router-dom'
import './CTASection.css'

const CTASection = () => {
  const navigate = useNavigate()

  return (
    <section className='cta-section'>
      <div className='cta-card'>
        <h2 className='cta-title'>Sẵn sàng bắt đầu?</h2>
        <p className='cta-description'>
          Đăng ký ngay để trải nghiệm tạo slide Toán học tự động
        </p>
        <button onClick={() => navigate('/register')} className='cta-button'>
          Đăng ký miễn phí
        </button>
      </div>
    </section>
  )
}

export default CTASection
