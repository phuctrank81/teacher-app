import React, { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'
import '../App.css'
import SupaBaseHeader from './supaBaseHeader'

export default function SupaBase() {
    const [users, setUsers] = useState([])

    const [user, setUser] = useState({
        name: '',
        age: '',
        fee: '',
        paid: false,
        gender: 'Nam',
        present: false,
    })

    const [user2, setUser2] = useState({
        id: '',
        name: '',
        age: '',
        fee: '',
        paid: false,
        gender: 'Nam',
        present: false,
    })

    useEffect(() => {
        fetchUsers()
    }, [])

    async function fetchUsers() {
        const { data, error } = await supabase.from('users').select('*')
        if (error) console.error('Supabase error:', error)
        else setUsers(data)
    }

    function handleChange(e) {
        const { name, type, value, checked } = e.target
        setUser(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }))
    }

    function handleChange2(e) {
        const { name, type, value, checked } = e.target
        setUser2(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }))
    }

    async function createUsers(e) {
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
                gender: 'Nam',
                present: false,
            })
        }
    }

    async function deleteUser(userId) {
        const { error } = await supabase.from('users').delete().eq('id', userId)
        if (error) console.log(error)
        else fetchUsers()
    }

    function displayUser(userId) {
        const selected = users.find(u => u.id === userId)
        if (selected) setUser2(selected)
    }

    async function updateUser(e) {
        e.preventDefault()

        const { id, name, age, fee, paid, gender, present } = user2
        const { error } = await supabase
            .from('users')
            .update({ name, age, fee, paid, gender, present })
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
                gender: 'Nam',
                present: false,
            })
        }
    }

    return (
        <div>
            <SupaBaseHeader/>
            {/* FORM 1 */}
            <form onSubmit={createUsers}>
                <h3>Thêm người dùng mới</h3>
                <input
                    type="text"
                    placeholder="Name"
                    name="name"
                    value={user.name}
                    onChange={handleChange}
                />
                <input
                    type="number"
                    placeholder="Age"
                    name="age"
                    value={user.age}
                    onChange={handleChange}
                />
                <input
                    type="number"
                    placeholder="Fee"
                    name="fee"
                    value={user.fee}
                    onChange={handleChange}
                />

                <select name="gender" value={user.gender} onChange={handleChange}>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                </select>

                <label>
                    <input
                        type="checkbox"
                        name="paid"
                        checked={user.paid}
                        onChange={handleChange}
                    />
                    Paid
                </label>

                <label>
                    <input
                        type="checkbox"
                        name="present"
                        checked={user.present}
                        onChange={handleChange}
                    />
                    Điểm danh
                </label>

                <button type="submit">Create</button>
            </form>

            {/* FORM 2 */}
            <form onSubmit={updateUser}>
                <h3>Chỉnh sửa thông tin</h3>
                <input
                    type="text"
                    name="name"
                    value={user2.name}
                    onChange={handleChange2}
                />
                <input
                    type="number"
                    name="age"
                    value={user2.age}
                    onChange={handleChange2}
                />
                <input
                    type="number"
                    name="fee"
                    value={user2.fee}
                    onChange={handleChange2}
                />

                <select name="gender" value={user2.gender} onChange={handleChange2}>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                </select>

                <label>
                    <input
                        type="checkbox"
                        name="paid"
                        checked={user2.paid}
                        onChange={handleChange2}
                    />
                    Paid
                </label>

                <label>
                    <input
                        type="checkbox"
                        name="present"
                        checked={user2.present}
                        onChange={handleChange2}
                    />
                    Điểm danh
                </label>

                <button type="submit">Save Changes</button>
            </form>

            <table className="table-student">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Fee</th>
                        <th>Gender</th>
                        <th>Paid</th>
                        <th>Điểm danh</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(u => (
                        <tr key={u.id}>
                            <td>{u.id}</td>
                            <td>{u.name}</td>
                            <td>{u.age}</td>
                            <td>{u.fee}</td>
                            <td>{u.gender}</td>
                            <td>{u.paid ? '✅ Đã đóng' : '❌ Chưa đóng'}</td>
                            <td>{u.present ? '🟢 Có mặt' : '🔴 Vắng'}</td>
                            <td>
                                <button onClick={() => deleteUser(u.id)}>Delete</button>
                                <button onClick={() => displayUser(u.id)}>Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}


//