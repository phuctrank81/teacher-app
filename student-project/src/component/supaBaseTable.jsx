import React, { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'
import '../App.css'
import { useNavigate } from 'react-router-dom'
import SupaBaseHeader from './supaBaseHeader'

export default function SupaBaseTable() {
    const navigate = useNavigate()
    const [users, setUsers] = useState([])
    const [selectedClass, setSelectedClass] = useState('10')

    const [user, setUser] = useState({
        name: '',
        age: '',
        fee: '',
        paid: false,
        paid_date: null,
        gender: 'Nam',
        class: '10',
    })

    const [user2, setUser2] = useState({
        id: '',
        name: '',
        age: '',
        fee: '',
        paid: false,
        paid_date: null,
        gender: 'Nam',
        class: '10',
    })

    // ===== FETCH DATA =====
    useEffect(() => {
        fetchUsers()
    }, [])

    async function fetchUsers() {
        const { data, error } = await supabase.from('users').select('*')
        if (error) console.error('Fetch users error:', error)
        else setUsers(data)
    }

    // ===== HANDLE INPUT =====
    function handleChange(e) {
        const { name, type, value, checked } = e.target
        let newValue = type === 'checkbox' ? checked : value

        setUser(prev => ({
            ...prev,
            [name]: newValue,
            ...(name === 'paid'
                ? { paid_date: newValue ? new Date().toISOString() : null }
                : {}),
        }))
    }

    function handleChange2(e) {
        const { name, type, value, checked } = e.target
        let newValue = type === 'checkbox' ? checked : value

        setUser2(prev => ({
            ...prev,
            [name]: newValue,
            ...(name === 'paid'
                ? { paid_date: newValue ? new Date().toISOString() : null }
                : {}),
        }))
    }

    // ===== CREATE USER =====
    async function createUser(e) {
        e.preventDefault()
        const { error } = await supabase.from('users').insert([user])
        if (error) console.error('Insert error:', error)
        else {
            fetchUsers()
            setUser({
                name: '',
                age: '',
                fee: '',
                paid: false,
                paid_date: null,
                gender: 'Nam',
                class: '10',
            })
        }
    }

    // ===== DISPLAY USER =====
    function displayUser(userId) {
        const selected = users.find(u => u.id === userId)
        if (selected) setUser2(selected)
    }

    // ===== UPDATE USER =====
    async function updateUser(e) {
        e.preventDefault()
        const { id, name, age, fee, paid, paid_date, gender, class: userClass } = user2
        const { error } = await supabase
            .from('users')
            .update({ name, age, fee, paid, paid_date, gender, class: userClass })
            .eq('id', id)
        if (error) console.log('Update error:', error)
        else {
            fetchUsers()
            setUser2({
                id: '',
                name: '',
                age: '',
                fee: '',
                paid: false,
                paid_date: null,
                gender: 'Nam',
                class: '10',
            })
        }
    }

    // ===== DELETE USER (SAFE) =====
    async function deleteUser(id) {
        const confirmDelete = window.confirm(
            'Bạn có chắc muốn xóa học sinh này không? Tất cả dữ liệu điểm danh liên quan cũng sẽ bị xóa.'
        )
        if (!confirmDelete) return

        // 1️⃣ Xóa bản ghi điểm danh có user_id tương ứng
        const { error: attError } = await supabase
            .from('attendance')
            .delete()
            .eq('user_id', id)

        if (attError) {
            console.error('Lỗi xóa dữ liệu điểm danh:', attError)
            alert('Không thể xóa điểm danh của học sinh này!')
            return
        }

        // 2️⃣ Sau đó xóa học sinh
        const { error: userError } = await supabase
            .from('users')
            .delete()
            .eq('id', id)

        if (userError) {
            console.error('Lỗi xóa học sinh:', userError)
            alert('Không thể xóa học sinh. Vui lòng thử lại!')
            return
        }

        // 3️⃣ Làm mới danh sách
        fetchUsers()
        alert('Đã xóa học sinh và dữ liệu điểm danh liên quan thành công!')
    }

    // ===== FILTER CLASS =====
    const filteredUsers = users.filter(u => u.class === selectedClass)

    // ===== FORMAT DATE =====
    function formatDate(dateString) {
        if (!dateString) return ''
        const date = new Date(dateString)
        return date.toLocaleDateString('vi-VN')
    }

    return (
        <div>
            <SupaBaseHeader />

            <div style={{ margin: '10px 0' }}>
                <button onClick={() => navigate('/attendance')}>
                    Mở bảng điểm danh
                </button>
            </div>

            {/* ===== BẢNG HỌC SINH ===== */}
            <h2>Danh sách học sinh</h2>
            <table className="table-student">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên</th>
                        <th>Tuổi</th>
                        <th>Giới tính</th>
                        <th>Lớp</th>
                        <th>Học phí</th>
                        <th>Đã đóng</th>
                        <th>Ngày đã đóng</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map(u => (
                        <tr key={u.id}>
                            <td>{u.id}</td>
                            <td>{u.name}</td>
                            <td>{u.age}</td>
                            <td>{u.gender}</td>
                            <td>{u.class}</td>
                            <td>{u.fee}₫</td>
                            <td>{u.paid ? '✅' : '❌'}</td>
                            <td>{formatDate(u.paid_date)}</td>
                            <td>
                                <button onClick={() => displayUser(u.id)}>Sửa</button>
                                <button onClick={() => deleteUser(u.id)}>Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* ===== LỌC LỚP ===== */}
            <div className="filter-class">
                <label>Chọn lớp: </label>
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
            </div>

            {/* ===== FORM 1 - THÊM HỌC SINH ===== */}
            <form onSubmit={createUser}>
                <h3>Thêm học sinh mới</h3>
                <input
                    type="text"
                    name="name"
                    placeholder="Tên"
                    value={user.name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="age"
                    placeholder="Tuổi"
                    value={user.age}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="fee"
                    placeholder="Học phí"
                    value={user.fee}
                    onChange={handleChange}
                    required
                />
                <select name="gender" value={user.gender} onChange={handleChange}>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                </select>
                <select name="class" value={user.class} onChange={handleChange}>
                    <option value="10">Lớp 10</option>
                    <option value="11">Lớp 11</option>
                    <option value="12">Lớp 12</option>
                    <option value="ielts1">IELTS 1</option>
                    <option value="ielts2">IELTS 2</option>
                    <option value="ielts3">IELTS 3</option>
                    <option value="ielts4">IELTS 4</option>
                </select>
                <label>
                    <input
                        type="checkbox"
                        name="paid"
                        checked={user.paid}
                        onChange={handleChange}
                    />
                    Đã đóng học phí
                </label>
                <button type="submit">Thêm</button>
            </form>

            {/* ===== FORM 2 - CHỈNH SỬA ===== */}
            <form onSubmit={updateUser}>
                <h3>Chỉnh sửa thông tin</h3>
                <input
                    type="text"
                    name="name"
                    value={user2.name}
                    onChange={handleChange2}
                    placeholder="Tên"
                />
                <input
                    type="number"
                    name="age"
                    value={user2.age}
                    onChange={handleChange2}
                    placeholder="Tuổi"
                />
                <input
                    type="number"
                    name="fee"
                    value={user2.fee}
                    onChange={handleChange2}
                    placeholder="Học phí"
                />
                <select name="gender" value={user2.gender} onChange={handleChange2}>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                </select>
                <select name="class" value={user2.class} onChange={handleChange2}>
                    <option value="10">Lớp 10</option>
                    <option value="11">Lớp 11</option>
                    <option value="12">Lớp 12</option>
                    <option value="ielts1">IELTS 1</option>
                    <option value="ielts2">IELTS 2</option>
                    <option value="ielts3">IELTS 3</option>
                    <option value="ielts4">IELTS 4</option>
                </select>
                <label>
                    <input
                        type="checkbox"
                        name="paid"
                        checked={user2.paid}
                        onChange={handleChange2}
                    />
                    Đã đóng học phí
                </label>
                <button type="submit">Lưu thay đổi</button>
            </form>
        </div>
    )
}
