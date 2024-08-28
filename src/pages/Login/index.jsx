import { useState } from "react"
import { LoginFormValidation } from "../../schema"
import * as Yup from "yup"
import { useDeliveryApp } from "../../hooks";
import { TbTruckDelivery } from "react-icons/tb";

const Login = () => {
    const [inputValues, setInputValues] = useState({
        userName: '',
        password: '',
        rememberMe: false
    })
    const [errors, setErrors] = useState({})
    const {
        loginAdmin
    } = useDeliveryApp()

    const handleValidation = async (e) => {
        const { name, value } = e.target
        try {
            setInputValues(prev => ({ ...prev, [name]: value }))
            const validation = Yup.object().shape({
                [name]: LoginFormValidation.fields[name],
            })
            await validation.validate({
                [name]: value
            })
            setErrors(prev => ({ ...prev, [name]: '' }))
        } catch (error) {
            console.error(error);
            setErrors(prev => ({ ...prev, [name]: error.message }))
        }
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        const loggedIn = await loginAdmin(inputValues)
        if (loggedIn) {
            window.location.href = '/'
        }
    }

    return (
        <div className="login-container">
            <div className="truck-logo">
                <TbTruckDelivery />
            </div>
            <div className="login-box">
                <h2>Delivery App</h2>
                <div>
                    <h3>Admin</h3>
                </div>
                <div>
                    <input
                        id="userName"
                        name="userName"
                        onChange={handleValidation}
                        type="text"
                        placeholder="username"
                        value={inputValues.userName}
                    />
                    {errors && errors.userName &&
                        <label htmlFor="userName">{errors.userName}</label>
                    }
                    <input
                        id="password"
                        name="password"
                        onChange={handleValidation}
                        type="password"
                        placeholder="password"
                        value={inputValues.password}
                    />
                    {errors && errors.password &&
                        <label htmlFor="password">{errors.password}</label>
                    }
                    <div className="remember-me">
                        <input
                            type="checkbox"
                            name="remember-me"
                            id="remember-me"
                            onChange={(e) =>
                                setInputValues((pre) => ({ ...pre, rememberMe: e.target.checked }))
                            }
                        />
                        <p onClick={() => {
                            document.getElementById('remember-me').checked = !inputValues.rememberMe
                            setInputValues((pre) => ({ ...pre, rememberMe: !inputValues.rememberMe }))
                        }}>Remember Me</p>
                    </div>
                </div>
                <div>
                    <button onClick={handleLogin}>
                        LOG IN
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Login