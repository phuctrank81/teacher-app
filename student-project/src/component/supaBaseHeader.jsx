import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function VietceteraHeader() {
  const navigate = useNavigate()

  const menuItems = [
    'Điểm Danh',
    'Lịch Sử Điểm Danh',
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
            color: 'black',
            fontSize: '28px'
          }}
          onClick={() => navigate('/homepage')}
        >
          Student Management System
        </h2>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            fontSize: '15px',
            color: 'black'
          }}
        >
          <span style={{ cursor: 'pointer' }}>International Edition</span>
          <span style={{ cursor: 'pointer' }}>🔍</span>
          <span style={{ cursor: 'pointer' }}>Đăng nhập</span>
          <button
            style={{
              backgroundColor: 'black',
              color: 'white',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Đăng ký
          </button>
        </div>
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
              position: 'relative'
            }}
            onMouseEnter={e => (e.target.style.color = '#007bff')}
            onMouseLeave={e => (e.target.style.color = 'black')}
          >
            {item}
          </span>
        ))}
      </nav>
    </header>
  )
}
