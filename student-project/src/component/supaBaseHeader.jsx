import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import '../App.css'

export default function SupaBaseHeader() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <header
      className="header"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        borderRadius: '8px',
        marginBottom: '20px'
      }}
    >
      <h1
        style={{ cursor: 'pointer' }}
        onClick={() => navigate('/homepage')}
      >
        Student Management
      </h1>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={() => navigate('/attendance')}
          style={{
            backgroundColor: location.pathname === '/attendance' ? '#0056b3' : 'white',
            color: location.pathname === '/attendance' ? 'white' : '#007bff',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Điểm danh
        </button>

        <button
          onClick={() => navigate('/MonthlyAttendanceHistory')}
          style={{
            backgroundColor:
              location.pathname === '/MonthlyAttendanceHistory' ? '#0056b3' : 'white',
            color:
              location.pathname === '/MonthlyAttendanceHistory' ? 'white' : '#007bff',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Lịch sử theo tháng
        </button>
      </div>
    </header>
  )
}
