import React, { useEffect, useState } from 'react'
import { supabase } from '../../../supabaseClient'
import '../../App.css'
import './AttendanceTable.css'
import SupaBaseHeader from '../../component/supaBaseHeader'
import Footer from '../../component/Footer'

// ====== HÀM XỬ LÝ GIỜ VIỆT NAM ======
function getTodayVN() {
  const now = new Date()
  const vnTime = new Date(now.getTime() + 7 * 60 * 60 * 1000)
  return vnTime.toISOString().slice(0, 10)
}

function toVietnamDateString(utcString) {
  const utcDate = new Date(utcString)
  const localDate = new Date(utcDate.getTime() + 7 * 60 * 60 * 1000)
  return localDate.toISOString().slice(0, 10)
}

export default function AttendanceTable() {
  const [users, setUsers] = useState([])
  const [attendance, setAttendance] = useState([])
  const [selectedClass, setSelectedClass] = useState('10')
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7))
  const [today, setToday] = useState(getTodayVN())
  const [isDeletingMonth, setIsDeletingMonth] = useState(false)

  // ======= LẤY DỮ LIỆU BAN ĐẦU =======
  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    fetchAttendance()
  }, [selectedMonth, today])

  // ======= TỰ CẬP NHẬT NGÀY MỚI =======
  useEffect(() => {
    const interval = setInterval(() => {
      const current = getTodayVN()
      if (current !== today) setToday(current)
    }, 60000)
    return () => clearInterval(interval)
  }, [today])

  // ======= SUPABASE FETCH =======
  async function fetchUsers() {
    const { data, error } = await supabase.from('users').select('*')
    if (error) console.error('❌ Lỗi lấy học sinh:', error)
    else setUsers(data)
  }

  async function fetchAttendance() {
    const [year, month] = selectedMonth.split('-').map(Number)
    const start = new Date(Date.UTC(year, month - 1, 1, -7, 0, 0))
    const end = new Date(Date.UTC(year, month, 0, 16, 59, 59, 999))

    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .gte('created_at', start.toISOString())
      .lte('created_at', end.toISOString())

    if (error) console.error('❌ Lỗi lấy điểm danh:', error)
    else setAttendance(data)
  }

  // ======= HÀM ĐIỂM DANH =======
  async function markAttendance(userId, isPresent) {
    const todayDate = getTodayVN()
    const startTime = new Date(`${todayDate}T00:00:00+07:00`).toISOString()
    const endTime = new Date(`${todayDate}T23:59:59+07:00`).toISOString()

    const { data: existing, error } = await supabase
      .from('attendance')
      .select('*')
      .eq('user_id', Number(userId))
      .gte('created_at', startTime)
      .lte('created_at', endTime)

    if (error) {
      alert('❌ Lỗi khi lấy dữ liệu điểm danh!')
      console.error(error)
      return
    }

    if (existing && existing.length > 0) {
      const current = existing[0]
      const { error: updateError } = await supabase
        .from('attendance')
        .update({ present: isPresent })
        .eq('id', current.id)

      if (updateError) {
        alert('❌ Lỗi khi cập nhật điểm danh!')
        console.error(updateError)
        return
      }

      setAttendance(prev =>
        prev.map(a => (a.id === current.id ? { ...a, present: isPresent } : a))
      )

      alert('✅ Đã cập nhật điểm danh hôm nay!')
    } else {
      const vnTimeNow = new Date(new Date().getTime() + 0 * 60 * 60 * 1000).toISOString()
      const { data: newRecord, error: insertError } = await supabase
        .from('attendance')
        .insert([
          {
            user_id: Number(userId),
            present: isPresent,
            created_at: vnTimeNow
          }
        ])
        .select()

      if (insertError) {
        alert(`❌ Lỗi khi thêm điểm danh: ${insertError.message}`)
        console.error('Chi tiết lỗi Supabase:', insertError)
        return
      }

      setAttendance(prev => [...prev, ...newRecord])
      alert('✅ Đã điểm danh mới!')
    }
  }

  // ======= XÓA ĐIỂM DANH THEO THÁNG =======
  async function deleteMonthlyAttendance() {
    const confirmDelete = window.confirm(
      `Bạn có chắc muốn xóa toàn bộ điểm danh của tháng ${selectedMonth} không?`
    )
    if (!confirmDelete) return

    setIsDeletingMonth(true)
    const [year, month] = selectedMonth.split('-').map(Number)
    const start = new Date(Date.UTC(year, month - 1, 1, -7, 0, 0))
    const end = new Date(Date.UTC(year, month, 0, 16, 59, 59, 999))

    const { error } = await supabase
      .from('attendance')
      .delete()
      .gte('created_at', start.toISOString())
      .lte('created_at', end.toISOString())

    if (error) {
      alert('Lỗi khi xóa dữ liệu tháng!')
      console.error(error)
    } else {
      alert(`✅ Đã xóa toàn bộ dữ liệu điểm danh tháng ${selectedMonth}!`)
      await fetchAttendance()
    }

    setIsDeletingMonth(false)
  }

  // ======= HÀM HỖ TRỢ =======
  const filteredUsers = users.filter(
    u => u.class?.trim().toLowerCase() === selectedClass.trim().toLowerCase()
  )

  function getTodayStatus(userId) {
    const record = attendance.find(a => {
      const date = toVietnamDateString(a.created_at)
      return a.user_id === userId && date === today
    })
    if (!record) return 'Chưa điểm danh'
    return record.present ? 'Có mặt' : 'Vắng'
  }

  function getAttendanceHistory(userId) {
    return attendance
      .filter(a => a.user_id === userId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5)
  }

  function getMonthlyAttendanceCount(userId) {
    const [year, month] = selectedMonth.split('-').map(Number)
    const start = new Date(Date.UTC(year, month - 1, 1, -7, 0, 0))
    const end = new Date(Date.UTC(year, month, 0, 16, 59, 59, 999))
    return attendance.filter(a => {
      const d = new Date(a.created_at)
      return a.user_id === userId && a.present && d >= start && d <= end
    }).length
  }

  // ======= GIAO DIỆN =======
  return (
    <div className="attendance-container">
      <SupaBaseHeader />
      <h2 className="attendance-title">BẢNG ĐIỂM DANH HỌC SINH</h2>

      <div className="filter-bar">
        <label>
          Lớp:{' '}
          <select
            className="class-select"
            value={selectedClass}
            onChange={e => setSelectedClass(e.target.value)}
          >
            <option value="8">Lớp 8</option>
            <option value="9">Lớp 9</option>
            <option value="12">Lớp 12</option>
            <option value="Ielts t3-t5 ca2">Ielts t3-t5 ca2</option>
            <option value="Ielts t2 - cn ">Ielts t2 - cn </option>
            <option value="Ielts t2-cn1">Ielts t2-cn1</option>
            <option value="Ielts t2-cn2">Ielts t2-cn2</option>
            <option value="Ielts t6-t7">Ielts t6-t7</option>
            <option value="Ielts t7-cn">Ielts t7-cn</option>
            <option value="Ielts H">Ielts H</option>
          </select>
        </label>

        <label className="month-label">
          Tháng:{' '}
          <input
            type="month"
            className="month-input"
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
          />
        </label>

        <button
          onClick={deleteMonthlyAttendance}
          className="btn-delete-month"
          disabled={isDeletingMonth}
        >
          {isDeletingMonth ? 'Đang xóa...' : `🗑 Xóa toàn bộ tháng ${selectedMonth}`}
        </button>
      </div>

      <table className="table-student">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên học sinh</th>
            <th>Giới tính</th>
            <th>Lớp</th>
            <th>Trạng thái hôm nay</th>
            <th>Điểm danh</th>
            <th>Lịch sử gần đây</th>
            <th>Tổng buổi có mặt (tháng)</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.gender}</td>
              <td>{u.class}</td>
              <td className="status-cell">{getTodayStatus(u.id)}</td>
              <td className="action-buttons">
                <button className="btn-present" onClick={() => markAttendance(u.id, true)}>
                  ✅ Có mặt
                </button>
                <button className="btn-absent" onClick={() => markAttendance(u.id, false)}>
                  ❌ Vắng
                </button>
              </td>
              <td className="history-cell">
                {getAttendanceHistory(u.id).length > 0 ? (
                  <ul>
                    {getAttendanceHistory(u.id).map(a => (
                      <li
                        key={a.id}
                        className={a.present ? 'history-present' : 'history-absent'}
                      >
                        {new Date(a.created_at).toLocaleString('vi-VN', {
                          dateStyle: 'short',
                          timeStyle: 'short'
                        })}{' '}
                        – {a.present ? 'Có mặt' : 'Vắng'}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span>Chưa có</span>
                )}
              </td>
              <td className="count-cell">{getMonthlyAttendanceCount(u.id)} / 8 buổi</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
