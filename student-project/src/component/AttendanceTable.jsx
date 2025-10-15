import React, { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'
import '../App.css'
import SupaBaseHeader from './supaBaseHeader'

export default function AttendanceTable() {
    const [users, setUsers] = useState([])
    const [attendance, setAttendance] = useState([])
    const [selectedClass, setSelectedClass] = useState('10')
    const [selectedMonth, setSelectedMonth] = useState(
        new Date().toISOString().slice(0, 7)
    )
    const [today, setToday] = useState(new Date().toISOString().split('T')[0]) // ✅ Thêm biến theo dõi ngày
    const [isDeletingMonth, setIsDeletingMonth] = useState(false)

    useEffect(() => {
        fetchUsers()
    }, [])

    // ✅ Khi đổi tháng hoặc qua ngày mới → cập nhật lại điểm danh
    useEffect(() => {
        fetchAttendance()
    }, [selectedMonth, today])

    // ✅ Cứ mỗi 60 giây kiểm tra xem có qua ngày mới chưa
    useEffect(() => {
        const interval = setInterval(() => {
            const current = new Date().toISOString().split('T')[0]
            if (current !== today) {
                setToday(current)
            }
        }, 60000)
        return () => clearInterval(interval)
    }, [today])

    async function fetchUsers() {
        const { data, error } = await supabase.from('users').select('*')
        if (error) console.error('Lỗi lấy học sinh:', error)
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

        if (error) console.error('Lỗi lấy điểm danh:', error)
        else setAttendance(data)
    }

    // ✅ Điểm danh học sinh
    async function markAttendance(userId, isPresent) {
        const today = new Date().toISOString().split('T')[0]

        const { data: existing } = await supabase
            .from('attendance')
            .select('*')
            .eq('user_id', userId)
            .gte('created_at', `${today}T00:00:00`)
            .lte('created_at', `${today}T23:59:59`)

        if (existing.length > 0) {
            await supabase
                .from('attendance')
                .update({ present: isPresent })
                .eq('id', existing[0].id)
            alert('✅ Đã cập nhật lại điểm danh hôm nay!')
        } else {
            await supabase
                .from('attendance')
                .insert([{ user_id: userId, present: isPresent }])
            alert('✅ Đã điểm danh mới!')
        }

        // ✅ Sau khi điểm danh → cập nhật lại danh sách ngay
        await fetchAttendance()
    }

    // 🗑 Xóa toàn bộ điểm danh trong tháng
    async function deleteMonthlyAttendance() {
        const confirmDelete = window.confirm(
            `Bạn có chắc muốn xóa toàn bộ điểm danh của tháng ${selectedMonth} không?`
        )
        if (!confirmDelete) return

        setIsDeletingMonth(true)

        const [year, month] = selectedMonth.split('-')
        const start = new Date(year, month - 1, 1)
        const end = new Date(year, month, 0, 23, 59, 59, 999)

        const { error } = await supabase
            .from('attendance')
            .delete()
            .gte('created_at', start.toISOString())
            .lte('created_at', end.toISOString())

        if (error) {
            alert('❌ Lỗi khi xóa dữ liệu tháng!')
            console.error(error)
        } else {
            alert(`🗑 Đã xóa toàn bộ dữ liệu điểm danh tháng ${selectedMonth}!`)
            await fetchAttendance()
        }

        setIsDeletingMonth(false)
    }

    // 🎯 Lọc học sinh theo lớp
    const filteredUsers = users.filter(u => u.class === selectedClass)

    // 📅 Trạng thái hôm nay
    function getTodayStatus(userId) {
        const record = attendance.find(a => {
            const date = new Date(a.created_at).toISOString().split('T')[0]
            return a.user_id === userId && date === today
        })
        if (!record) return 'Chưa điểm danh'
        return record.present ? 'Có mặt' : 'Vắng'
    }

    // 📜 Lịch sử 5 buổi gần nhất
    function getAttendanceHistory(userId) {
        return attendance
            .filter(a => a.user_id === userId)
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 5)
    }

    // 📊 Tổng số buổi có mặt trong tháng
    function getMonthlyAttendanceCount(userId) {
        return attendance.filter(a => a.user_id === userId && a.present).length
    }

    return (
        <div>
            <SupaBaseHeader />
            <h2>BẢNG ĐIỂM DANH HỌC SINH</h2>

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

                <button
                    onClick={deleteMonthlyAttendance}
                    className="btn-delete-month"
                    disabled={isDeletingMonth}
                    style={{
                        marginLeft: '20px',
                        backgroundColor: '#d9534f',
                        color: 'white',
                        border: 'none',
                        padding: '8px 12px',
                        borderRadius: '6px'
                    }}
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
                            <td>{getTodayStatus(u.id)}</td>
                            <td>
                                <button className="btn-present" onClick={() => markAttendance(u.id, true)}>
                                    ✅ Có mặt
                                </button>
                                <button className="btn-absent" onClick={() => markAttendance(u.id, false)}>
                                    ❌ Vắng
                                </button>
                            </td>

                            <td>
                                {getAttendanceHistory(u.id).length > 0 ? (
                                    <ul>
                                        {getAttendanceHistory(u.id).map(a => (
                                            <li
                                                key={a.id}
                                                style={{
                                                    color: a.present ? 'green' : 'red',
                                                    fontWeight: '500'
                                                }}
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

                            <td>{getMonthlyAttendanceCount(u.id)} / 8 buổi</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}


// incinerate 
