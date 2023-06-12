import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import { postCreateUser } from '../services/UserService';
import { toast } from 'react-toastify';

function ModalAddNew(props) {
    const { show, handleClose, handleUpdateTable } = props
    const [name, setName] = useState('')
    const [job, setJob] = useState('')

    const handleSaveUser = async () => {
        let res = await postCreateUser(name, job)
        if (res && res.id) {
            setName('')
            setJob('')
            handleClose()
            toast.success('User created success')
            handleUpdateTable({ first_name: name, id: res.id })
        } else {
            toast.error('Have a error happen')
        }
        console.log('>>check state : ', res);
    }

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>ADD NEW USER</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='body-add-new'>
                    <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input
                            type='text'
                            className="form-control"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Job</label>
                        <input
                            type='text'
                            className="form-control"
                            value={job}
                            onChange={(event) => setJob(event.target.value)}
                        />
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={() => handleSaveUser()}>
                    Save User
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalAddNew;