import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../App.css'

export default function SupaBaseHeader() {
  const navigate = useNavigate()

  return (
    <div>
      <header
        className="header"
        style={{ cursor: 'pointer' }}
        onClick={() => navigate('/')} // 👈 Bấm vào header sẽ trở về trang chính
      >
        <h1>Student Management</h1>
      </header>
    </div>
  )
}
