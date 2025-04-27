import { useSelector, useDispatch } from 'react-redux'
import AddChannelModal from './modal/Add.jsx'
import RenameChannelModal from './modal/Rename.jsx'
import RemoveChannelModal from './modal/Remove.jsx'
import { closeModal } from '../slices/uiSlice.js'

const ModalContainer = () => {
  const dispatch = useDispatch()
  const { modal, modalProps } = useSelector(s => s.ui)
  const hide = () => dispatch(closeModal())

  if (!modal) return null

  switch (modal) {
    case 'add': {
      const { existingChannelNames, onSubmit } = modalProps
      return (
        <AddChannelModal
          show
          handleClose={hide}
          existingChannelNames={existingChannelNames}
          onSubmit={onSubmit}
        />
      )
    }
    case 'rename': {
      const { currentName, existingChannelNames, onSubmit } = modalProps
      return (
        <RenameChannelModal
          show
          handleClose={hide}
          currentName={currentName}
          existingChannelNames={existingChannelNames}
          onSubmit={onSubmit}
        />
      )
    }
    case 'remove': {
      const { onConfirm } = modalProps
      return (
        <RemoveChannelModal
          show
          handleClose={hide}
          onConfirm={onConfirm}
        />
      )
    }
    default:
      return null
  }
}

export default ModalContainer
