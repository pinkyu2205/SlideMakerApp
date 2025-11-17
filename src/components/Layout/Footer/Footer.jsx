import { BookOpen } from 'lucide-react'
import './Footer.css'

const Footer = () => {
  return (
    <footer className='footer'>
      <div className='footer-container'>
        <div className='footer-grid'>
          <div className='footer-section'>
            <div className='footer-logo'>
              <BookOpen className='footer-logo-icon' />
              <span className='footer-logo-text'>MathSlides</span>
            </div>
            <p className='footer-description'>
              Nền tảng tạo slide Toán học tự động cho giáo viên và học sinh.
            </p>
          </div>

          <div className='footer-section'>
            <h3 className='footer-title'>Liên kết</h3>
            <ul className='footer-links'>
              <li>
                <a href='#' className='footer-link'>
                  Về chúng tôi
                </a>
              </li>
              <li>
                <a href='#' className='footer-link'>
                  Hướng dẫn sử dụng
                </a>
              </li>
              <li>
                <a href='#' className='footer-link'>
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a href='#' className='footer-link'>
                  Điều khoản sử dụng
                </a>
              </li>
            </ul>
          </div>

          <div className='footer-section'>
            <h3 className='footer-title'>Liên hệ</h3>
            <ul className='footer-contact'>
              <li>Email: contact@mathslides.com</li>
              <li>Hotline: 1900 xxxx</li>
              <li>Địa chỉ: Hồ Chí Minh, Việt Nam</li>
            </ul>
          </div>
        </div>

        <div className='footer-bottom'>
          <p>&copy; 2025 MathSlides. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
