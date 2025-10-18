import React, { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'
import '../App.css'
import SupaBaseHeader from './supaBaseHeader'
import Footer from './Footer'

export default function MonthlyAttendanceHistory() {
  const [users, setUsers] = useState([])
  const [attendance, setAttendance] = useState([])
  const [selectedClass, setSelectedClass] = useState('10')
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  )

  // ===== LẤY DỮ LIỆU NGƯỜI DÙNG =====
  useEffect(() => {
    fetchUsers()
  }, [])

  // ===== LẤY DỮ LIỆU ĐIỂM DANH =====
  useEffect(() => {
    fetchAttendance()
  }, [selectedMonth])

  async function fetchUsers() {
    const { data, error } = await supabase.from('users').select('*')
    if (error) console.error('❌ Lỗi lấy users:', error)
    else setUsers(data)
  }

  async function fetchAttendance() {
    const [year, month] = selectedMonth.split('-').map(Number)

    // Mốc đầu tháng (00:00 ngày 1, giờ VN)
    const start = new Date(Date.UTC(year, month - 1, 1, -7, 0, 0))
    // Mốc cuối tháng (23:59:59 ngày cuối, giờ VN)
    const end = new Date(Date.UTC(year, month, 0, 16, 59, 59, 999))

    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .gte('created_at', start.toISOString())
      .lte('created_at', end.toISOString())

    if (error) console.error('❌ Lỗi lấy attendance:', error)
    else setAttendance(data)
  }

  // ===== HÀM HỖ TRỢ =====

  // Lọc học sinh theo lớp
  const filteredUsers = users.filter(u => u.class === selectedClass)

  // Tạo danh sách ngày trong tháng
  function getDaysInMonth(year, month) {
    const days = []
    const date = new Date(year, month - 1, 1)
    while (date.getMonth() + 1 === month) {
      days.push(new Date(date))
      date.setDate(date.getDate() + 1)
    }
    return days
  }

  const [year, month] = selectedMonth.split('-').map(Number)
  const daysInMonth = getDaysInMonth(year, month)

  // ✅ Hàm chuyển sang ngày giờ Việt Nam CHUẨN, không cộng trùng giờ
  function toVietnamDateString(utcString) {
    const utcDate = new Date(utcString)
    const vnDate = new Date(
      utcDate.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' })
    )
    const yyyy = vnDate.getFullYear()
    const mm = String(vnDate.getMonth() + 1).padStart(2, '0')
    const dd = String(vnDate.getDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
  }

  // Format local date cho các ô ngày
  function toLocalDateString(dateObj) {
    const yyyy = dateObj.getFullYear()
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0')
    const dd = String(dateObj.getDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
  }

  // Kiểm tra trạng thái điểm danh trong ngày
  function getStatusForDay(userId, day) {
    const record = attendance.find(a => {
      const date = toVietnamDateString(a.created_at)
      return a.user_id === userId && date === day
    })
    if (!record) return null
    return record.present ? 'present' : 'absent'
  }

  return (
    <div>
      <SupaBaseHeader />
      <h2>LỊCH SỬ ĐIỂM DANH THEO THÁNG</h2>

      {/* ==== THANH LỌC ==== */}
      <div className="filter-bar">
        <label>
          Lớp:{' '}
          <select
            value={selectedClass}
            onChange={e => setSelectedClass(e.target.value)}
          >
            <option value="10">Lớp 10</option>
            <option value="11">Lớp 11</option>
            <option value="12">Lớp 12</option>
            <option value="Ielts t3-t5 ca2">Ielts t3-t5 ca2</option>
            <option value="Ielts t2 - cn ">Ielts t2 - cn </option>
            <option value="ielts t2-cn(1)">Ielts t2-cn(1)</option>
            <option value="ielts t2-cn (2)">Ielts t2-cn (2)</option>
            <option value="ielts t6-t7">Ielts t6-t7</option>
            <option value="ielts t7-cn">Ielts t7-cn</option>
            <option value="Ielts H">Ielts H</option>
          </select>
        </label>

        <label style={{ marginLeft: '20px' }}>
          Tháng:{' '}
          <input
            type="month"
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
          />
        </label>
      </div>

      {/* ==== BẢNG ĐIỂM DANH ==== */}
      <div className="scroll-container">
        <table className="table-student">
          <thead>
            <tr>
              <th>Tên học sinh</th>
              {daysInMonth.map((d, i) => (
                <th key={i}>{d.getDate()}</th>
              ))}
              <th>Tổng có mặt</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(u => {
              const totalPresent = daysInMonth.filter(d => {
                const status = getStatusForDay(u.id, toLocalDateString(d))
                return status === 'present'
              }).length

              return (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  {daysInMonth.map((d, i) => {
                    const status = getStatusForDay(u.id, toLocalDateString(d))
                    return (
                      <td
                        key={i}
                        style={{
                          backgroundColor:
                            status === 'present'
                              ? '#c8f7c5'
                              : status === 'absent'
                              ? '#f7c5c5'
                              : 'white',
                          textAlign: 'center'
                        }}
                      >
                        {status === 'present'
                          ? 'Có mặt'
                          : status === 'absent'
                          ? 'Không có mặt'
                          : ''}
                      </td>
                    )
                  })}
                  <td style={{ fontWeight: 'bold' }}>{totalPresent}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
