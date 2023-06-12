import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

import { UserContext } from "../context/UserContext";
import { loginApi } from "../services/UserService";


function Login() {
    const navigate = useNavigate()

    const { loginContext } = useContext(UserContext)

    const [email, setEmail] = useState('')
    const [passwod, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleLogin = async () => {
        if (!email || !passwod) {
            toast.error('Missing email or password is required!')
            return
        }
        setLoading(true)
        let res = await loginApi(email.trim(), passwod)
        console.log('res : ', res);

        if (res && res.token) {
            loginContext(email, res.token)
            navigate("/")
            toast.success('Login succed')
        } else {
            if (res && res.status === 400) {
                toast.error(res.data.error)
            }
        }
        setLoading(false)
    }

    const handlePressEnter = (event) => {
        if (event && event.key === 'Enter') {
            handleLogin()
        }
    }

    const handleGoBack = () => {
        navigate("/")
    }
    useEffect(() => {
        let token = localStorage.getItem('token');
        if (token) {
            toast.warning("Your account is logging!")
            navigate("/")
        }
    }, [])

    return (
        <>
            <div className="login-container col-12 col-sm-4">
                <div className="title">Log in</div>
                <div className="text">
                    <span>Email or Username ( eve.holt@reqres.in )</span>
                    <span>Login with phone</span>
                </div>
                <input
                    type="text"
                    placeholder="Email or username..."
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                />
                <div className="input-passwod">
                    <input
                        type={showPassword === true ? "text" : "password"}
                        placeholder="Password..."
                        value={passwod}
                        onChange={(event) => setPassword(event.target.value)}
                        onKeyDown={(event) => handlePressEnter(event)}
                    />
                    <i
                        onClick={() => setShowPassword(!showPassword)}
                        className={showPassword === true ? "fa-regular fa-eye" : "fa-regular fa-eye-slash"}>
                    </i>
                </div>

                <button
                    className={email && passwod ? "btn-login active" : "btn-login"}
                    disabled={(email && passwod) && !loading ? false : true}
                    onClick={() => handleLogin()}
                >
                    {loading && <i className="fa-solid fa-spinner fa-spin"></i>}
                    &nbsp; Login
                </button>

                <div className="go-back">
                    <div onClick={()=>handleGoBack()}>
                        <i className="fa-solid fa-chevron-left"></i>
                        <span>Go back</span>
                    </div>
                </div>
            </div>
        </>
    ); <p></p>
}

export default Login;