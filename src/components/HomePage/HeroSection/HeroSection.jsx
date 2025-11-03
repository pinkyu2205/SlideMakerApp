import { useNavigate } from 'react-router-dom'
import './HeroSection.css'

const HeroSection = () => {
  const navigate = useNavigate()

  return (
    <section className='hero-section'>
      <div className='hero-content'>
        <h1 className='hero-title'>
          Tạo slide Toán học{' '}
          <span className='hero-highlight'>dễ dàng và nhanh chóng</span>
        </h1>
        <p className='hero-description'>
          Nền tảng tự động tạo slide thuyết trình Toán học cho các cấp Tiểu học,
          THCS và THPT theo chương trình GDPT 2018
        </p>
        <div className='hero-buttons'>
          <button
            onClick={() => navigate('/register')}
            className='hero-btn-primary'
          >
            Bắt đầu ngay
          </button>
          <button className='hero-btn-secondary'>Xem demo</button>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
