import { BookOpen, Users, Zap } from 'lucide-react'
import FeatureCard from '../FeatureCard/FeatureCard'
import './FeaturesSection.css'

const FeaturesSection = () => {
  return (
    <section className='features-section'>
      <h2 className='features-title'>Tính năng nổi bật</h2>
      <div className='features-grid'>
        <FeatureCard
          icon={Zap}
          title='Tạo slide tự động'
          description='Tự động sinh slide từ template với nội dung tóm tắt, công thức và hình ảnh minh họa'
        />
        <FeatureCard
          icon={BookOpen}
          title='Theo chuẩn GDPT 2018'
          description='Nội dung được biên soạn theo chương trình Giáo dục phổ thông 2018 của Bộ GD&ĐT'
        />
        <FeatureCard
          icon={Users}
          title='Dễ dàng tùy chỉnh'
          description='Chỉnh sửa nội dung, thêm elements và kéo-thả để tùy chỉnh vị trí các phần tử'
        />
      </div>
    </section>
  )
}

export default FeaturesSection
