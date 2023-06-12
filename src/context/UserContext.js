import { createContext, useState } from "react";

// @function  UserContext
const UserContext = createContext({ email: '', auth: false });

// @function  UserProvider
// Create function to provide UserContext
const UserProvider = ({ children }) => {
    const [user, setUser] = useState({ email: '', auth: false });

    const loginContext = (email, token) => {
        localStorage.setItem("token", token)
        localStorage.setItem('email', email)
        setUser((user) => ({
            email: email,
            auth: true,
        }));
    };

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('email')

        setUser((user) => ({
            email: '',
            auth: false,
        }));
    };

    return (
        <UserContext.Provider value={{ user, loginContext, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export { UserContext, UserProvider }