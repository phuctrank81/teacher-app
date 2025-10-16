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
    const [today, setToday] = useState(new Date().toISOString().split('T')[0])
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
            const current = new Date().toISOString().split('T')[0]
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
        const [year, month] = selectedMonth.split('-')
        const start = new Date(year, month - 1, 1)
        const end = new Date(year, month, 0, 23, 59, 59, 999)

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
        const todayDate = new Date().toISOString().split('T')[0]

        // 1️⃣ Kiểm tra xem hôm nay đã có điểm danh chưa
        const { data: existing, error } = await supabase
            .from('attendance')
            .select('*')
            .eq('user_id', userId)
            .gte('created_at', `${todayDate}T00:00:00`)
            .lte('created_at', `${todayDate}T23:59:59`)

        if (error) {
            alert('❌ Lỗi khi lấy dữ liệu điểm danh!')
            return
        }

        // 2️⃣ Nếu đã có -> cập nhật lại
        if (existing.length > 0) {
            const current = existing[0]
            const { error: updateError } = await supabase
                .from('attendance')
                .update({ present: isPresent })
                .eq('id', current.id)

            if (updateError) {
                alert('❌ Lỗi khi cập nhật điểm danh!')
                return
            }

            // Cập nhật ngay trong state
            setAttendance(prev =>
                prev.map(a =>
                    a.id === current.id ? { ...a, present: isPresent } : a
                )
            )

            alert('✅ Đã cập nhật điểm danh hôm nay!')
        } else {
            // 3️⃣ Nếu chưa có -> thêm mới
            const { data: newRecord, error: insertError } = await supabase
                .from('attendance')
                .insert([{ user_id: userId, present: isPresent }])
                .select()

            if (insertError) {
                alert('❌ Lỗi khi thêm điểm danh!')
                return
            }

            // Thêm ngay vào state (để tăng số buổi)
            setAttendance(prev => [...prev, ...newRecord])
            alert('✅ Đã điểm danh mới!')
        }

        // 4️⃣ Cập nhật tổng buổi có mặt (tất cả)
        await updateUserTotalPresent(userId)
    }

    // ======= CẬP NHẬT TỔNG BUỔI CÓ MẶT (TRONG USERS) =======
    async function updateUserTotalPresent(userId) {
        const { data: presentList, error } = await supabase
            .from('attendance')
            .select('*')
            .eq('user_id', userId)
            .eq('present', true)

        if (error) {
            console.error('❌ Lỗi khi đếm buổi có mặt:', error)
            return
        }

        const total = presentList.length

        const { error: updateError } = await supabase
            .from('users')
            .update({ total_present: total })
            .eq('id', userId)

        if (updateError)
            console.error('❌ Lỗi khi cập nhật total_present:', updateError)
        else console.log(`✅ Cập nhật total_present = ${total} cho user ${userId}`)

        // Cập nhật ngay trong state users
        setUsers(prev =>
            prev.map(u =>
                u.id === userId ? { ...u, total_present: total } : u
            )
        )
    }

    // ======= XÓA ĐIỂM DANH THEO THÁNG =======
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

    // ======= HÀM HỖ TRỢ =======
    const filteredUsers = users.filter(u => u.class === selectedClass)

    function getTodayStatus(userId) {
        const record = attendance.find(a => {
            const date = new Date(a.created_at).toISOString().split('T')[0]
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

    // Đếm tổng buổi có mặt trong tháng hiện tại
    function getMonthlyAttendanceCount(userId) {
        const [year, month] = selectedMonth.split('-')
        const start = new Date(year, month - 1, 1)
        const end = new Date(year, month, 0, 23, 59, 59, 999)
        return attendance.filter(a => {
            const d = new Date(a.created_at)
            return (
                a.user_id === userId &&
                a.present &&
                d >= start &&
                d <= end
            )
        }).length
    }

    // ======= GIAO DIỆN =======
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
                    {isDeletingMonth
                        ? 'Đang xóa...'
                        : `🗑 Xóa toàn bộ tháng ${selectedMonth}`}
                </button>
            </div>

            <table className="table-student">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên học sinh</th>
                        <th>Giới tính</th>
                        <th>Lớp</th>
                        <th>Tổng buổi có mặt (tất cả)</th>
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
                            <td>{u.total_present || 0}</td>
                            <td>{getTodayStatus(u.id)}</td>
                            <td>
                                <button
                                    className="btn-present"
                                    onClick={() => markAttendance(u.id, true)}
                                >
                                    ✅ Có mặt
                                </button>
                                <button
                                    className="btn-absent"
                                    onClick={() => markAttendance(u.id, false)}
                                >
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
                                                    color: a.present
                                                        ? 'green'
                                                        : 'red',
                                                    fontWeight: '500'
                                                }}
                                            >
                                                {new Date(
                                                    a.created_at
                                                ).toLocaleString('vi-VN', {
                                                    dateStyle: 'short',
                                                    timeStyle: 'short'
                                                })}{' '}
                                                –{' '}
                                                {a.present
                                                    ? 'Có mặt'
                                                    : 'Vắng'}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <span>Chưa có</span>
                                )}
                            </td>
                            <td>
                                {getMonthlyAttendanceCount(u.id)} / 8 buổi
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
