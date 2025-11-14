import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../supabaseClient'
import ProfilePage  from '../pages/ProfilePage/profile'


export default function SupabaseHeader() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    // Lấy thông tin user hiện tại
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data?.user || null)
    }
    getUser()

    // Lắng nghe thay đổi session
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem('supabase_session')
    setUser(null)
    navigate('/Login')
  }

  const menuItems = [
    { name: 'Điểm Danh', path: '/attendance' },
    { name: 'Lịch Sử Điểm Danh', path: '/MonthlyAttendanceHistory' }
  ]

  return (
    <header
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderBottom: '1px solid #ccc',
        backgroundColor: 'white',
        fontFamily: 'Arial, sans-serif',
        padding: '10px 0'
      }}
    >
      {/* Logo + Góc phải */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 40px'
        }}
      >
        <h2
          style={{
            fontWeight: 'bold',
            cursor: 'pointer',
            color: '#0078d4',
            fontSize: '28px'
          }}
          onClick={() => navigate('/homepage')}
        >
          Student Management System
        </h2>

        {/* Nếu chưa đăng nhập */}
        {!user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span
              style={{
                color: 'black',
                cursor: 'pointer',
                fontWeight: '500',
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={e => (e.target.style.color = '#0078d4')}
              onMouseLeave={e => (e.target.style.color = 'black')}
              onClick={() => navigate('/login')}
            >
              Đăng nhập
            </span>
            <button
              style={{
                backgroundColor: '#0078d4',
                color: 'white',
                border: '2px solid #0078d4',
                padding: '6px 14px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: '500',
                transition: 'background-color 0.3s ease'
              }}
              onMouseEnter={e => (e.target.style.backgroundColor = '#005fa3')}
              onMouseLeave={e => (e.target.style.backgroundColor = '#0078d4')}
              onClick={() => navigate('/signup')}
            >
              Đăng ký
            </button>
          </div>
        ) : (
          // Nếu đã đăng nhập -> avatar + menu thả xuống
          <div style={{ position: 'relative' }}>
            <div
              onClick={() => setShowMenu(!showMenu)}
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: '#0078d4',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '18px',
                cursor: 'pointer'
              }}
            >
              {user?.email?.[0]?.toUpperCase() || 'U'}
            </div>

            {showMenu && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '50px',
                  backgroundColor: 'white',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  width: '230px',
                  zIndex: 100
                }}
              >
                <div style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                  <strong>{user.email}</strong>
                  <p style={{ fontSize: '13px', color: 'gray' }}>Tác giả</p>
                </div>
                <div
                  onClick={() => {
                    navigate('/profile')
                    setShowMenu(false)
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 12px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  <span></span> Thông tin tài khoản
                </div>
                <div
                  onClick={handleLogout}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 12px',
                    cursor: 'pointer',
                    color: 'red',
                    fontSize: '14px'
                  }}
                >
                  <span></span> Đăng xuất
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Menu ngang */}
      <nav
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '30px',
          marginTop: '10px',
          fontSize: '17px',
          fontWeight: '500'
        }}
      >
        {menuItems.map((item, index) => (
          <span
            key={index}
            style={{
              cursor: 'pointer',
              color: 'black',
              transition: 'color 0.3s ease'
            }}
            onMouseEnter={e => (e.target.style.color = '#0078d4')}
            onMouseLeave={e => (e.target.style.color = 'black')}
            onClick={() => navigate(item.path)}
          >
            {item.name}
          </span>
        ))}
      </nav>
    </header>
  )
}
