import React, { useState } from 'react'
import { supabase } from '../../supabaseClient'
import { Link, useNavigate } from 'react-router-dom'
import './Login.css'

import '../App.css' // hoặc tạo file riêng Login.css

const Login = ({ setToken }) => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({ email: '', password: '' })

    function handleChange(event) {
        setFormData(prev => ({
            ...prev,
            [event.target.name]: event.target.value
        }))
    }

    async function handleSubmit(e) {
        e.preventDefault()
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password
            })

            if (error) throw error

            console.log(data)
            localStorage.setItem('supabase_session', JSON.stringify(data.session))
            setToken(data.session.access_token)
            navigate('/homepage')
        } catch (error) {
            alert(error.message)
        }
    }

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Login</h2>
                <input
                    placeholder="Email"
                    name="email"
                    onChange={handleChange}
                    className="login-input"
                    required
                />
                <input
                    placeholder="Password"
                    name="password"
                    type="password"
                    onChange={handleChange}
                    className="login-input"
                    required
                />
                <button type="submit" className="login-button">
                    Submit
                </button>
                <p className="login-text">
                    Don't have an account?{' '}
                    <Link to="/signup" className="login-link">
                        Sign Up
                    </Link>
                </p>
            </form>
        </div>
    )
}

export default Login
