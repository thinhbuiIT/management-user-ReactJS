import { Routes, Route } from 'react-router-dom';

import Home from '../components/Home';
import TableUser from '../components/TableUser';
import Login from '../components/Login';

import PrivateRoutes from './PrivateRoutes';
import NotFound from './NotFound';
function AppRoutes() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home />}></Route>
                <Route path="/login" element={<Login />}></Route>
                <Route path='/users' element={
                    <PrivateRoutes>
                        <TableUser />
                    </PrivateRoutes>
                }></Route>
                <Route path="*" element={<NotFound />}></Route>
            </Routes>
        </>
    );
}

export default AppRoutes;