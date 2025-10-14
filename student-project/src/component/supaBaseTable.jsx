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

    // ===== DELETE USER =====
    async function deleteUser(id) {
        const { error } = await supabase.from('users').delete().eq('id', id)
        if (error) console.log('Delete error:', error)
        else fetchUsers()
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

            {/* Lọc lớp */}
            <div className="filter-class">
                <label>Chọn lớp: </label>
                <select
                    value={selectedClass}
                    onChange={e => setSelectedClass(e.target.value)}
                >
                    <option value="10">Lớp 10</option>
                    <option value="11">Lớp 11</option>
                    <option value="12">Lớp 12</option>
                </select>
            </div>

            {/* FORM 1 - Thêm học sinh */}
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

            {/* FORM 2 - Chỉnh sửa */}
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
        </div>
    )
}
