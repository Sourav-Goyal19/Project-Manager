import './Modal.css'

export const Modal = (props) => {
  return (
    <div className='Modal' onClick={() => props.onClose()}>
      <div onClick={(e) => e.stopPropagation()} className="modal-inner">
        {props.children}
      </div>
    </div>
  )
}
