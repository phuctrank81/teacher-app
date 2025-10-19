import React, { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'
import '../App.css'
import SupaBaseHeader from './supaBaseHeader'
import Footer from './Footer'
import { useNavigate } from 'react-router-dom'

export default function SupaBaseTable() {
    const [users, setUsers] = useState([])
    const [selectedClass, setSelectedClass] = useState('10')

    const [user, setUser] = useState({
        name: '',
        age: '',
        paid: false,
        paid_date: null,
        gender: 'Nam',
        class: '10',
    })

    const [user2, setUser2] = useState({
        id: '',
        name: '',
        age: '',
        paid: false,
        paid_date: null,
        gender: 'Nam',
        class: '10',
    })

    useEffect(() => {
        fetchUsers()
    }, [])

    async function fetchUsers() {
        const { data, error } = await supabase.from('users').select('*')
        if (error) console.error('Fetch users error:', error)
        else setUsers(data)
    }

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

    async function createUser(e) {
        e.preventDefault()
        const { error } = await supabase.from('users').insert([user])
        if (error) console.error('Insert error:', error)
        else {
            fetchUsers()
            setUser({
                name: '',
                age: '',
                paid: false,
                paid_date: null,
                gender: 'Nam',
                class: '8',
            })
        }
    }

    function displayUser(userId) {
        const selected = users.find(u => u.id === userId)
        if (selected) setUser2(selected)
    }

    async function updateUser(e) {
        e.preventDefault()
        const { id, name, age, paid, paid_date, gender, class: userClass } = user2
        const { error } = await supabase
            .from('users')
            .update({ name, age, paid, paid_date, gender, class: userClass })
            .eq('id', id)
        if (error) console.log('Update error:', error)
        else {
            fetchUsers()
            setUser2({
                id: '',
                name: '',
                age: '',
                paid: false,
                paid_date: null,
                gender: 'Nam',
                class: '8',
            })
        }
    }

    async function deleteUser(id) {
        const confirmDelete = window.confirm(
            'Bạn có chắc muốn xóa học sinh này không? Tất cả dữ liệu điểm danh liên quan cũng sẽ bị xóa.'
        )
        if (!confirmDelete) return

        const { error: attError } = await supabase
            .from('attendance')
            .delete()
            .eq('user_id', id)
        if (attError) {
            console.error('Lỗi xóa dữ liệu điểm danh:', attError)
            alert('Không thể xóa điểm danh của học sinh này!')
            return
        }

        const { error: userError } = await supabase
            .from('users')
            .delete()
            .eq('id', id)
        if (userError) {
            console.error('Lỗi xóa học sinh:', userError)
            alert('Không thể xóa học sinh. Vui lòng thử lại!')
            return
        }

        fetchUsers()
        alert('Đã xóa học sinh và dữ liệu điểm danh liên quan thành công!')
    }

    const filteredUsers = users.filter(
        u => u.class?.toLowerCase().trim().replace(/\(|\)/g, '') ===
            selectedClass.toLowerCase().trim().replace(/\(|\)/g, '')
    )


    function formatDate(dateString) {
        if (!dateString) return ''
        const date = new Date(dateString)
        return date.toLocaleDateString('vi-VN')
    }

    let navigate = useNavigate()

    async function handleLogout() {
        const { error } = await supabase.auth.signOut()
        if (error) {
            console.error('Lỗi khi đăng xuất:', error)
            alert('Không thể đăng xuất. Vui lòng thử lại!')
            return
        }

        // ✅ Xóa token / session lưu trong sessionStorage
        sessionStorage.removeItem('token')
        localStorage.removeItem('supabase_session')

        // ✅ Điều hướng về trang Login
        navigate('/')
    }


    return (
        <div>
            <SupaBaseHeader />
            <button onClick={handleLogout}>Logout</button>

            {/* ===== LỌC LỚP ===== */}
            <div className="filter-class">
                <label>Chọn lớp: </label>
                <select
                    value={selectedClass}
                    onChange={e => setSelectedClass(e.target.value)}
                >
                    <option value="8">Lớp 8</option>
                    <option value="9">Lớp 9</option>
                    <option value="12">Lớp 12</option>
                    <option value="Ielts t3-t5 ca2">Ielts t3-t5 ca2</option>
                    <option value="Ielts t2-cn1">Ielts t2-cn1</option>
                    <option value="Ielts t2-cn2">Ielts t2-cn2</option>
                    <option value="Ielts t2-cn">Ielts t2-cn</option>
                    <option value="Ielts t6-t7">Ielts t6-t7</option>
                    <option value="Ielts t7-cn">Ielts t7-cn</option>
                    <option value="Ielts H">Ielts H</option>
                </select>
            </div>

            {/* ===== BẢNG HỌC SINH ===== */}
            <h2>Danh sách học sinh</h2>
            <p style={{ marginTop: '10px', fontWeight: 'bold', textAlign: 'center' }}>
                Tổng cộng trong bảng này: {filteredUsers.length} học sinh
            </p>

            <table className="table-student">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên</th>
                        <th>Tuổi</th>
                        <th>Giới tính</th>
                        <th>Lớp</th>
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
                <select name="gender" value={user.gender} onChange={handleChange}>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                </select>
                <select name="class" value={user.class} onChange={handleChange}>
                    <option value="8">Lớp 8</option>
                    <option value="9">Lớp 9</option>
                    <option value="12">Lớp 12</option>
                    <option value="Ielts t3-t5 ca2">Ielts t3-t5 ca2</option>
                    <option value="Ielts t2-cn1">Ielts t2-cn1</option>
                    <option value="Ielts t2-cn2">Ielts t2-cn2</option>
                    <option value="Ielts t2-cn">Ielts t2-cn</option>
                    <option value="Ielts t6-t7">Ielts t6-t7</option>
                    <option value="Ielts t7-cn">Ielts t7-cn</option>
                    <option value="Ielts H">Ielts H</option>
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
                <select name="gender" value={user2.gender} onChange={handleChange2}>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                </select>
                <select name="class" value={user2.class} onChange={handleChange2}>
                    <option value="8">Lớp 8</option>
                    <option value="9">Lớp 9</option>
                    <option value="12">Lớp 12</option>
                    <option value="Ielts t3-t5 ca2">Ielts t3-t5 ca2</option>
                    <option value="Ielts t2-cn1">Ielts t2-cn1</option>
                    <option value="Ielts t2-cn2">Ielts t2-cn2</option>
                    <option value="Ielts t2-cn">Ielts t2-cn</option>
                    <option value="Ielts t6-t7">Ielts t6-t7</option>
                    <option value="Ielts t7-cn">Ielts t7-cn</option>
                    <option value="Ielts H">Ielts H</option>
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
            <Footer />
        </div>
    )
}
