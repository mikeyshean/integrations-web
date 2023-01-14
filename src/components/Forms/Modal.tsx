import ModalContainer from './ModalContainer'


export default function Modal({ cancelText, submitText, onSubmit, show, toggleModal, children }:
  {
    cancelText: string,
    submitText: string,
    onSubmit: () => void,
    show: boolean,
    toggleModal: () => void,
    children: React.ReactNode
  }) {
  
  
  return (
    <ModalContainer cancelText={cancelText} submitText={submitText} onSubmit={onSubmit} show={show} toggleModal={toggleModal}>
      {children}
    </ModalContainer>
  )
}
