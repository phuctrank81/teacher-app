import React, { useState } from 'react'
import { supabase } from '../../../supabaseClient'
import { Link, useNavigate } from 'react-router-dom'
import './Login.css'
import Iridescence from '../../component/Iridescence'

const Login = ({ setToken }) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [resetEmail, setResetEmail] = useState('')
  const [showReset, setShowReset] = useState(false)
  const [loading, setLoading] = useState(false)

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

      if (data?.session) {
        localStorage.setItem('supabase_session', JSON.stringify(data.session))
        setToken(data.session.access_token)
        navigate('/homepage')
      } else {
        alert('Không nhận được session từ Supabase.')
      }
    } catch (error) {
      alert(error.message)
    }
  }

  async function handleResetPassword(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: 'http://localhost:3000/reset-password'
      })
      if (error) throw error
      alert('Đã gửi email đặt lại mật khẩu.')
      setShowReset(false)
    } catch (error) {
      alert('Lỗi: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-wrapper">

      {/* 🔥 Background Iridescence */}
      <div className="iridescence-bg">
        <Iridescence
          color={[1, 1, 1]}
          mouseReact={false}
          amplitude={0.1}
          speed={1.0}
        />
      </div>

      {/* 🔥 Login form overlay */}
      <div className="login-container">

        {!showReset ? (
          <form className="login-form" onSubmit={handleSubmit}>
            <h2>Login</h2>

            <input
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="login-input"
              required
            />

            <input
              placeholder="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="login-input"
              required
            />

            <button type="submit" className="login-button">
              Submit
            </button>

            <p className="login-text">
              <button
                type="button"
                className="forgot-password"
                onClick={() => setShowReset(true)}
              >
                Forgot Password?
              </button>
            </p>

            <p className="login-text">
              Don't have an account?{' '}
              <Link to="/signup" className="login-link">
                Sign Up
              </Link>
            </p>
          </form>
        ) : (
          <form className="login-form" onSubmit={handleResetPassword}>
            <h2>Reset Password</h2>

            <input
              type="email"
              placeholder="Enter your email"
              value={resetEmail}
              onChange={e => setResetEmail(e.target.value)}
              className="login-input"
              required
            />

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Email'}
            </button>

            <button
              type="button"
              className="login-button secondary"
              onClick={() => setShowReset(false)}
            >
              Back to Login
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default Login
