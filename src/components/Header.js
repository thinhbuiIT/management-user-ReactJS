import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import logoApp from '../assets/images/logo192.png';

import { useLocation, NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UserContext } from '../context/UserContext';
import { useContext } from 'react';

const Header = (props) => {
    let location = useLocation()
    const navigate = useNavigate()

    const { logout, user } = useContext(UserContext)

    const handleLogout = () => {
        logout()
        navigate("/");
        toast.success('Logout is succed')
    }

    return (
        <>
            <Navbar bg="light" expand="lg" >
                <Container>
                    <Navbar.Brand>
                        <NavLink className='nav-link' to={'/'}>
                            <img src={logoApp} alt="Logo App" width={30} height={30} />
                            <span>Practise Intern</span>
                        </NavLink>
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="basic-navbar-nav" />

                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto" activeKey={location.pathname}>
                            <NavLink className='nav-link' to='/'>Home</NavLink>
                            {user && user.auth === true && <NavLink className='nav-link' to='/users'>Manage User</NavLink>}
                        </Nav>
                        <Nav>
                            {user.email && <span className='nav-link'>Hi! {user.email}</span>}
                            <NavDropdown title="Setting" id="basic-nav-dropdown" className='justify-content-end'>
                                {
                                    user && user.email ?
                                        <>
                                            <NavLink
                                                className='nav-link'
                                                onClick={() => handleLogout()}
                                            >
                                                Logout
                                            </NavLink>

                                        </>
                                        : <NavLink className='nav-link' to={'login'}>Login</NavLink>
                                }
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>

                </Container>
            </Navbar>
        </>
    );
}

export default Header