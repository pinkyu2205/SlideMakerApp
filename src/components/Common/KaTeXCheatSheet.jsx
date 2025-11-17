import { Copy, GripHorizontal, X } from 'lucide-react'
import { useRef, useState } from 'react' // 1. Thêm useRef
import Draggable from 'react-draggable'
import { InlineMath } from 'react-katex'
import './KaTeXCheatSheet.css'

const FORMULA_GROUPS = [
  // ... (Giữ nguyên danh sách FORMULA_GROUPS như cũ) ...
  {
    title: 'Cơ bản & Phân số',
    items: [
      { label: 'Phân số', code: '\\frac{a}{b}' },
      { label: 'Hỗn số', code: '2\\frac{1}{3}' },
      { label: 'Nhân', code: '\\times' },
      { label: 'Chia', code: '\\div' },
      { label: 'Cộng trừ', code: '\\pm' },
    ],
  },
  {
    title: 'Mũ & Căn thức',
    items: [
      { label: 'Số mũ', code: 'x^2' },
      { label: 'Mũ phức tạp', code: 'x^{a+b}' },
      { label: 'Chỉ số dưới', code: 'x_1' },
      { label: 'Căn bậc 2', code: '\\sqrt{x}' },
      { label: 'Căn bậc n', code: '\\sqrt[n]{x}' },
    ],
  },
  {
    title: 'Hình học & Ký hiệu',
    items: [
      { label: 'Góc', code: '\\angle ABC' },
      { label: 'Độ', code: '90^\\circ' },
      { label: 'Tam giác', code: '\\triangle' },
      { label: 'Pi', code: '\\pi' },
      { label: 'Vô cực', code: '\\infty' },
      { label: 'Vuông góc', code: '\\perp' },
      { label: 'Song song', code: '\\parallel' },
    ],
  },
  {
    title: 'Quan hệ & Logic',
    items: [
      { label: 'Lớn hơn hoặc bằng', code: '\\geq' },
      { label: 'Nhỏ hơn hoặc bằng', code: '\\leq' },
      { label: 'Khác', code: '\\neq' },
      { label: 'Xấp xỉ', code: '\\approx' },
      { label: 'Thuộc', code: '\\in' },
      { label: 'Suy ra', code: '\\Rightarrow' },
    ],
  },
]

const KaTeXCheatSheet = ({ onClose }) => {
  const [copyStatus, setCopyStatus] = useState(null)

  // 2. Tạo nodeRef để tránh lỗi findDOMNode trong React 18
  const nodeRef = useRef(null)

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code)
    setCopyStatus(code)
    setTimeout(() => setCopyStatus(null), 1500)
  }

  return (
    // 3. Truyền nodeRef vào Draggable
    <Draggable handle='.cheat-sheet-header' bounds='body' nodeRef={nodeRef}>
      {/* 4. Truyền ref={nodeRef} vào thẻ div con trực tiếp */}
      <div className='katex-cheat-sheet' ref={nodeRef}>
        {/* Header - Vùng để kéo thả */}
        <div className='cheat-sheet-header'>
          <div className='header-title'>
            <GripHorizontal size={18} className='drag-icon' />
            <span>Bảng công thức Toán</span>
          </div>
          <button onClick={onClose} className='close-btn'>
            <X size={18} />
          </button>
        </div>

        {/* Body - Danh sách công thức */}
        <div className='cheat-sheet-body'>
          {FORMULA_GROUPS.map((group, idx) => (
            <div key={idx} className='formula-group'>
              <h4>{group.title}</h4>
              <div className='formula-grid'>
                {group.items.map((item, i) => (
                  <div
                    key={i}
                    className='formula-item'
                    onClick={() => handleCopy(item.code)}
                    title='Bấm để copy'
                  >
                    <div className='formula-display'>
                      <InlineMath math={item.code} />
                    </div>
                    <div className='formula-code'>{item.code}</div>
                    <div className='copy-overlay'>
                      {copyStatus === item.code ? (
                        <span className='copied-text'>Đã copy!</span>
                      ) : (
                        <Copy size={16} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className='cheat-sheet-footer'>
            <small>Mẹo: Kéo thanh tiêu đề để di chuyển</small>
          </div>
        </div>
      </div>
    </Draggable>
  )
}

export default KaTeXCheatSheet
