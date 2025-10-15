import React, { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'

import '../App.css'
import SupaBaseHeader from './supaBaseHeader'

export default function AttendanceTable() {
    
    const [users, setUsers] = useState([])
    const [attendance, setAttendance] = useState([])
    const [selectedClass, setSelectedClass] = useState('10')
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split('T')[0]
    )

    // ===== LẤY DỮ LIỆU =====
    useEffect(() => {
        fetchUsers()
        fetchAttendance()
    }, [selectedDate])

    async function fetchUsers() {
        const { data, error } = await supabase.from('users').select('*')
        if (error) console.error('Lỗi lấy học sinh:', error)
        else setUsers(data)
    }

    async function fetchAttendance() {
        const start = new Date(selectedDate)
        start.setHours(0, 0, 0, 0)
        const end = new Date(selectedDate)
        end.setHours(23, 59, 59, 999)

        const { data, error } = await supabase
            .from('attendance')
            .select('*')
            .gte('created_at', start.toISOString())
            .lte('created_at', end.toISOString())
            .order('created_at', { ascending: false })

        if (error) console.error('Lỗi lấy điểm danh:', error)
        else setAttendance(data)
    }

    // ===== GHI ĐIỂM DANH =====
    async function markAttendance(userId, isPresent) {
        const { error } = await supabase.from('attendance').insert([
            {
                user_id: userId,
                present: isPresent,
            },
        ])
        if (error) console.error('Lỗi điểm danh:', error)
        else fetchAttendance()
    }

    // ===== XỬ LÝ HIỂN THỊ =====
    const filteredUsers = users.filter(u => u.class === selectedClass)

    function getTodayStatus(userId) {
        const record = attendance.find(a => a.user_id === userId)
        if (!record) return 'Chưa điểm danh'
        return record.present ? 'Có mặt' : 'Vắng'
    }

    function getAttendanceHistory(userId) {
        const history = attendance
            .filter(a => a.user_id === userId)
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 5)
        return history
    }

    return (
        <div>
            <SupaBaseHeader />

            <h2>BẢNG ĐIỂM DANH HỌC SINH</h2>

            <div style={{ margin: '10px 0' }}>
      </div>

            {/* ===== BỘ LỌC ===== */}
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
                        <option value="ielts1">IELTS 1</option>
                        <option value="ielts2">IELTS 2</option>
                        <option value="ielts3">IELTS 3</option>
                        <option value="ielts4">IELTS 4</option>
                    </select>
                </label>

                <label style={{ marginLeft: '20px' }}>
                    Ngày:{' '}
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={e => setSelectedDate(e.target.value)}
                    />
                </label>
            </div>

            {/* ===== BẢNG ĐIỂM DANH ===== */}
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
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map(u => (
                        <tr key={u.id}>
                            <td>{u.id}</td>
                            <td>{u.name}</td>
                            <td>{u.gender}</td>
                            <td>{u.class}</td>
                            <td>{getTodayStatus(u.id)}</td>
                            <td>
                                <button onClick={() => markAttendance(u.id, true)}>
                                    Có mặt
                                </button>
                                <button onClick={() => markAttendance(u.id, false)}>
                                    Vắng
                                </button>
                            </td>
                            <td>
                                {getAttendanceHistory(u.id).length > 0 ? (
                                    <ul>
                                        {getAttendanceHistory(u.id).map(a => (
                                            <li key={a.id}>
                                                {new Date(a.created_at).toLocaleString('vi-VN')} -{' '}
                                                {a.present ? 'Có mặt' : 'Vắng'}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <span>Chưa có</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
