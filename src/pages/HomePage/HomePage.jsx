import BenefitsSection from '../../components/HomePage/BenefitsSection/BenefitsSection'
import CTASection from '../../components/HomePage/CTASection/CTASection'
import FeaturesSection from '../../components/HomePage/FeaturesSection/FeaturesSection'
import HeroSection from '../../components/HomePage/HeroSection/HeroSection'
import './HomePage.css'

const HomePage = () => {
  return (
    <div className='homepage'>
      <HeroSection />
      <FeaturesSection />
      <BenefitsSection />
      <CTASection />
    </div>
  )
}

export default HomePage
