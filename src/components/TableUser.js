
import { useEffect, useState } from 'react';
import { fetchAllUser } from '../services/UserService';

import Table from 'react-bootstrap/Table';
import ReactPaginate from 'react-paginate';
import _, { debounce, result } from 'lodash';
import Papa from 'papaparse';

import ModalAddNew from './ModalAddNew';
import ModalEditUser from './ModalEditUser';
import ModalConfirm from './ModalConfirm';
import { CSVLink } from 'react-csv';
import { toast } from 'react-toastify';


const TableUser = (props) => {

    const [listUsers, setListUsers] = useState([])
    const [totalUsers, setTotalUsers] = useState(0)
    const [totalPages, setTotalPages] = useState(0)

    const [isShowModalAddNew, setIsShowModalAddNew] = useState(false)
    const [isShowModalEdit, setIsShowModalEdit] = useState(false)
    const [isShowModalDelete, setIsShowModalDelete] = useState(false)

    const [dataUserEdit, setDataUserEdit] = useState({})
    const [dataUserDelete, setDataUserDelete] = useState({})

    const [sortBy, setSortBy] = useState('')
    const [sortField, setSortField] = useState('')

    const [dataExport, setDataExport] = useState([])

    const handleClose = () => {
        setIsShowModalAddNew(false)
        setIsShowModalEdit(false)
        setIsShowModalDelete(false)
    }

    const handlePageClick = (evt) => {
        getUsers(+evt.selected + 1)
    }

    const getUsers = async (page) => {
        let res = await fetchAllUser(page);
        if (res && res.data) {
            setTotalUsers(res.total)
            setTotalPages(res.total_pages)
            setListUsers(res.data)
        }
    }

    const handleUpdateTable = (user) => {
        setListUsers([user, ...listUsers])
    }

    const handleEditUser = (user) => {
        setIsShowModalEdit(true)
        setDataUserEdit(user)
    }

    const handleEditUserModal = (user) => {
        let cloneListUser = _.cloneDeep(listUsers)
        let index = listUsers.findIndex(item => item.id === user.id)
        cloneListUser[index].first_name = user.first_name
        setListUsers(cloneListUser)
    }

    const handleDeleteUser = (user) => {
        console.log('user : ', user);
        setIsShowModalDelete(true)
        setDataUserDelete(user)
    }

    const handleDeleteUserModal = (user) => {
        let cloneListUser = _.cloneDeep(listUsers)
        cloneListUser = cloneListUser.filter(item => item.id !== user.id)
        setListUsers(cloneListUser)
    }

    const handleSort = (sortBy, sortField) => {
        setSortBy(sortBy)
        setSortField(sortField)
        let cloneListUser = _.cloneDeep(listUsers)
        cloneListUser = _.orderBy(cloneListUser, [sortField], [sortBy])
        setListUsers(cloneListUser)
    }

    const handleSearch = debounce((event) => {
        let term = event.target.value
        console.log(event.target.value);
        if (term) {
            let cloneListUser = _.cloneDeep(listUsers)
            cloneListUser = cloneListUser.filter(item => item.email.includes(term))
            setListUsers(cloneListUser)
        } else {
            getUsers(1)
        }
    }, 500)

    const getUserExport = (event, done) => {
        let result = [];
        if (listUsers && listUsers.length > 0) {
            result.push(["Id", "Email", "First Name", "Last Name", "Avatar"])
            listUsers.map((item, index) => {
                let arr = [];
                arr[0] = item.id;
                arr[1] = item.email;
                arr[2] = item.first_name;
                arr[3] = item.last_name;
                arr[4] = item.avatar;
                result.push(arr)
            })
            setDataExport(result)
            done()
        }
    }

    const handleImportCSV = (event) => {
        if (event.target && event.target.files && event.target.files[0]){
            let file = event.target.files[0];
            console.log('OUTPUT : ',file);
            if(file.type !== "text/csv"){
                toast.error('Upload file type csv ! Pls')
                return
            }

            Papa.parse(file, {
                header:true,
                complete: (result) => {
                    console.log('Finished : ',result.data);
                }
            })
        }
    }

    useEffect(() => {
        getUsers()
    }, [])

    return (
        <>
            <div className='my-3 add-new d-sm-flex'>
                <span className=''>List Users:</span>
                <div className='group-btns mt-sm-0 mt-2'>

                    <label htmlFor='file' className='btn btn-secondary'>
                        <i className="fa-solid fa-file-import"></i>
                        Import
                    </label>
                    <input
                        type="file"
                        id='file'
                        hidden
                        onChange={(event) => handleImportCSV(event)}
                    />

                    <CSVLink
                        className='btn btn-primary'
                        data={dataExport}
                        filename={'user-data.csv'}
                        asyncOnClick={true}
                        onClick={getUserExport}
                    >
                        Export
                        <i className="fa-solid fa-download"></i>
                    </CSVLink>

                    <button
                        className='btn btn-success'
                        onClick={() => setIsShowModalAddNew(true)}
                    >
                        <i className="fa-solid fa-plus"></i>
                        Add new
                    </button>
                </div>
            </div>

            <div className='col-12 col-sm-4 my-3'>
                <input
                    type="text"
                    className='form-control'
                    placeholder='Search user by email'
                    onChange={(event) => handleSearch(event)}
                />
            </div>

            <div className='customize-table'>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>
                                <div className='sort-header'>
                                    <span>ID</span>
                                    <span>
                                        <i
                                            className="fa-sharp fa-solid fa-arrow-down"
                                            onClick={() => handleSort('desc', 'id')}
                                        ></i>
    
                                        <i
                                            className="fa-sharp fa-solid fa-arrow-up"
                                            onClick={() => handleSort('asc', 'id')}
                                        ></i>
                                    </span>
                                </div>
                            </th>
                            <th>Email</th>
                            <th>
                                <div className='sort-header'>
                                    <span>First Name</span>
                                    <span>
                                        <i
                                            className="fa-sharp fa-solid fa-arrow-down"
                                            onClick={() => handleSort('desc', 'first_name')}
                                        ></i>
    
                                        <i
                                            className="fa-sharp fa-solid fa-arrow-up"
                                            onClick={() => handleSort('asc', 'first_name')}
                                        ></i>
                                    </span>
                                </div>
                            </th>
                            <th>Last Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listUsers && listUsers.length > 0 &&
                            listUsers.map((user, index) => (
                                <tr key={`users-${index}`}>
                                    <td>{user.id}</td>
                                    <td>{user.email}</td>
                                    <td>{user.first_name}</td>
                                    <td>{user.last_name}</td>
                                    <td>
                                        <button
                                            className='btn btn-warning mx-3'
                                            onClick={() => handleEditUser(user)}
                                        >Edit
                                        </button>
                                        <button
                                            className='btn btn-danger'
                                            onClick={() => handleDeleteUser(user)}
                                        >Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </Table>
            </div>
            <div className='d-flex justify-content-center'>
                <ReactPaginate
                    breakLabel="..."
                    nextLabel="Next >"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={5}
                    pageCount={totalPages}
                    previousLabel="< Previous"
                    pageClassName='page-item'
                    pageLinkClassName='page-link'
                    previousClassName='page-item'
                    previousLinkClassName='page-link'
                    nextClassName='page-item'
                    nextLinkClassName='page-link'
                    breakClassName='page-item'
                    breakLinkClassName='page-link'
                    containerClassName='pagination'
                    activeClassName='active'
                    renderOnZeroPageCount={null}
                />
            </div>
            <ModalAddNew
                show={isShowModalAddNew}
                handleClose={handleClose}
                handleUpdateTable={handleUpdateTable}
            />
            <ModalEditUser
                show={isShowModalEdit}
                dataUserEdit={dataUserEdit}
                handleClose={handleClose}
                handleEditUserModal={handleEditUserModal}
            />

            <ModalConfirm
                show={isShowModalDelete}
                handleClose={handleClose}
                handleDeleteUserModal={handleDeleteUserModal}
                dataUserDelete={dataUserDelete}
            />
        </>
    );
}

export default TableUser