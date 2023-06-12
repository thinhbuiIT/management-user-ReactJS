import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { deleteUser } from '../services/UserService';
import { toast } from 'react-toastify';

function ModalConfirm(props) {
    const { show, handleClose, handleDeleteUserModal, dataUserDelete } = props

    const confirmDelete = async() => {
        let res = await deleteUser(dataUserDelete.id)
        if (res && +res.statusCode === 204){
            toast.success('Delete user succed')
            handleClose()
            handleDeleteUserModal(dataUserDelete)
        }else{
            toast.error('Delete user failed')
        }
        console.log(res)
    }
 
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>DELETE USER</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='body-add-new'>
                    <p>This action can't be undo! <br />
                        Do you wan delete this user, <b>email = "{dataUserDelete.email}" ?</b>
                    </p>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={() => confirmDelete()}>
                    Confirm
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalConfirm;