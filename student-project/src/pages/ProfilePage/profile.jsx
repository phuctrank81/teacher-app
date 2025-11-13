import React, { useEffect, useState } from 'react'
import { supabase } from '../../../supabaseClient'
import { useNavigate } from 'react-router-dom'

export default function ProfilePage() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')

  // Lấy thông tin người dùng từ Supabase
  useEffect(() => {
    const getUserData = async () => {
      const { data } = await supabase.auth.getUser()
      if (!data?.user) {
        navigate('/login')
        return
      }

      const user = data.user
      setUser(user)
      setEmail(user.email)
      setFullName(user.user_metadata?.full_name || '')
      setLoading(false)
    }
    getUserData()
  }, [navigate])

  const handleUpdateProfile = async () => {
    if (!user) return

    setLoading(true)
    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName }
    })

    if (error) {
      alert('❌ Cập nhật thất bại: ' + error.message)
    } else {
      alert('✅ Cập nhật thành công!')
    }
    setLoading(false)
  }

  if (loading) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Đang tải...</p>

  return (
    <div
      style={{
        maxWidth: '500px',
        margin: '50px auto',
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        fontFamily: 'Arial, sans-serif'
      }}
    >
      <h2 style={{ textAlign: 'center', color: '#0078d4', marginBottom: '20px' }}>
        Thông Tin Tài Khoản
      </h2>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px' }}>Email</label>
        <input
          type="text"
          value={email}
          disabled
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            backgroundColor: '#f5f5f5'
          }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px' }}>Họ và tên</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Nhập họ và tên..."
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc'
          }}
        />
      </div>

      <button
        onClick={handleUpdateProfile}
        disabled={loading}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: '#0078d4',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          fontSize: '16px',
          fontWeight: '500',
          cursor: 'pointer'
        }}
      >
        {loading ? 'Đang cập nhật...' : 'Cập nhật thông tin'}
      </button>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button
          onClick={() => navigate('/homepage')}
          style={{
            background: 'none',
            color: '#0078d4',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          ← Quay lại trang chủ
        </button>
      </div>
    </div>
  )
}
