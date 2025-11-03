const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <div className='bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow'>
      <div className='bg-cyan-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4'>
        <Icon className='h-6 w-6 text-cyan-600' />
      </div>
      <h3 className='text-xl font-semibold mb-2 text-gray-800'>{title}</h3>
      <p className='text-gray-600'>{description}</p>
    </div>
  )
}

export default FeatureCard
