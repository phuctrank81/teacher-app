import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function VietceteraHeader() {
  const navigate = useNavigate()

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

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            fontSize: '15px'
          }}
        >
          <span
            style={{
              color: '#0078d4',
              cursor: 'pointer',
              fontWeight: '500',
              transition: '0.3s'
            }}
            onMouseEnter={e => (e.target.style.color = '#0078d4')}
            onMouseLeave={e => (e.target.style.color = 'black')}
          >
            Đăng nhập
          </span>

          {/* Nút Đăng ký giữ nguyên */}
          <button
            style={{
              backgroundColor: '#0078d4',
              color: 'white',
              border: '2px solid #0078d4',
              padding: '6px 14px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '500',
              transition: '0.3s'
            }}
            onMouseEnter={e => {
              e.target.style.backgroundColor = '#005fa3'
            }}
            onMouseLeave={e => {
              e.target.style.backgroundColor = '#0078d4'
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
          fontWeight: '500',
          color: 'black'
        }}
      >
        {menuItems.map((item, index) => (
          <span
            key={index}
            style={{
              cursor: 'pointer',
              position: 'relative',
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
