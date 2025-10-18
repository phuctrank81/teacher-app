import React, { useState } from 'react'
import { supabase } from '../../supabaseClient'
import { Link } from 'react-router-dom'
import './Signup.css' // nhớ import file CSS

const Signup = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: ''
    })

    function handleChange(event) {
        setFormData(prev => ({
            ...prev,
            [event.target.name]: event.target.value
        }))
    }

    async function handleSubmit(e) {
        e.preventDefault()

        try {
            await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        first_name: formData.fullName, // sửa lại chính tả từ firt_name → first_name
                    },
                },
            })
            alert('✅ Check your email for verification link!')
        } catch (error) {
            alert(error.message)
        }
    }

    return (
        <div className="signup-container">
            <form className="signup-form" onSubmit={handleSubmit}>
                <h2>Create Account</h2>

                <input
                    placeholder="Full name"
                    name="fullName"
                    onChange={handleChange}
                    className="signup-input"
                    required
                />

                <input
                    placeholder="Email"
                    name="email"
                    type="email"
                    onChange={handleChange}
                    className="signup-input"
                    required
                />

                <input
                    placeholder="Password"
                    name="password"
                    type="password"
                    onChange={handleChange}
                    className="signup-input"
                    required
                />

                <button type="submit" className="signup-button">
                    Sign Up
                </button>

                <p className="signup-text">
                    Already have an account?{' '}
                    <Link to="/" className="signup-link">
                        Login
                    </Link>
                </p>
            </form>
        </div>
    )
}

export default Signup
