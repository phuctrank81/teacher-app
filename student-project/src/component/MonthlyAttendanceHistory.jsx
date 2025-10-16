import React, { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'
import '../App.css'
import SupaBaseHeader from './supaBaseHeader'

export default function MonthlyAttendanceHistory() {
  const [users, setUsers] = useState([])
  const [attendance, setAttendance] = useState([])
  const [selectedClass, setSelectedClass] = useState('10')
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  )

  // ===== LẤY DỮ LIỆU =====
  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    fetchAttendance()
  }, [selectedMonth])

  async function fetchUsers() {
    const { data, error } = await supabase.from('users').select('*')
    if (error) console.error('❌ Lỗi lấy users:', error)
    else setUsers(data)
  }

  async function fetchAttendance() {
    const [year, month] = selectedMonth.split('-')
    const start = new Date(year, month - 1, 1)
    const end = new Date(year, month, 0, 23, 59, 59, 999)

    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .gte('created_at', start.toISOString())
      .lte('created_at', end.toISOString())

    if (error) console.error('❌ Lỗi lấy attendance:', error)
    else setAttendance(data)
  }

  // ===== HỖ TRỢ =====
  const filteredUsers = users.filter(u => u.class === selectedClass)

  // Lấy danh sách ngày trong tháng
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

  // Kiểm tra trạng thái điểm danh của học sinh trong ngày
  function getStatusForDay(userId, day) {
    const record = attendance.find(a => {
      const date = new Date(a.created_at).toISOString().split('T')[0]
      return a.user_id === userId && date === day
    })
    if (!record) return null
    return record.present ? 'present' : 'absent'
  }

  return (
    <div>
      <SupaBaseHeader />
      <h2>LỊCH SỬ ĐIỂM DANH THEO THÁNG</h2>

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
                const status = getStatusForDay(
                  u.id,
                  d.toISOString().split('T')[0]
                )
                return status === 'present'
              }).length

              return (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  {daysInMonth.map((d, i) => {
                    const status = getStatusForDay(
                      u.id,
                      d.toISOString().split('T')[0]
                    )
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
                          ? '✅'
                          : status === 'absent'
                          ? '❌'
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
