import './TemplateCard.css'

const TemplateCard = ({ template, onSelect }) => {
  return (
    <div
      className='template-card'
      onClick={() => onSelect(template.templateID)}
    >
      <div className='template-card-thumbnail'>
        <img src={template.thumbnailUrl} alt={template.name} />
      </div>
      <div className='template-card-content'>
        <h3 className='template-card-title'>{template.name}</h3>
        <p className='template-card-description'>{template.description}</p>
        {template.tags && (
          <div className='template-card-tags'>
            {template.tags.split(',').map((tag) => (
              <span key={tag} className='template-card-tag'>
                {tag.trim()}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default TemplateCard
