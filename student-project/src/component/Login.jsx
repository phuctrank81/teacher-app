import React, { useState } from 'react'
import { supabase } from '../../supabaseClient'
import { Link, useNavigate } from 'react-router-dom'

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
            setToken(data.session.access_token)
            navigate('/homepage')
        } catch (error) {
            alert(error.message)
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    placeholder='Email'
                    name='email'
                    onChange={handleChange}
                />
                <input
                    placeholder='Password'
                    name='password'
                    type='password'
                    onChange={handleChange}
                />
                <button type='submit'>
                    Submit
                </button>
            </form>
            Don't have an account? <Link to="/signup">Sign Up</Link>
        </div>
    )
}

export default Login
