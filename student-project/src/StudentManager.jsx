import React, { useState } from "react";
import "./StudentManager.css";

export default function StudentManager() {
  const [students, setStudents] = useState([
    { id: 1, name: "Nguyễn Văn A", class: "10A1", fee: 1000000, paid: true, date: "2025-10-06" },
    { id: 2, name: "Trần Thị B", class: "10A2", fee: 1000000, paid: false, date: "2025-10-01" },
  ]);

  const [newStudent, setNewStudent] = useState({
    name: "",
    class: "",
    fee: "",
    date: "",
  });

  const addStudent = () => {
    if (!newStudent.name || !newStudent.class || !newStudent.fee || !newStudent.date) return;
    setStudents([
      ...students,
      {
        id: Date.now(),
        name: newStudent.name,
        class: newStudent.class,
        fee: parseInt(newStudent.fee, 10),
        paid: false,
        date: newStudent.date,
      },
    ]);
    setNewStudent({ name: "", class: "", fee: "", date: "" });
  };

  const togglePaid = (id) => {
    setStudents(
      students.map((s) => (s.id === id ? { ...s, paid: !s.paid } : s))
    );
  };

  return (
    <div className="student-manager">
      <div className="title">
        <h2>📘 Quản lý học sinh đóng tiền học</h2>
      </div>

      <div className="add-form">
        <input
          placeholder="Tên học sinh"
          value={newStudent.name}
          onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
        />
        <input
          placeholder="Lớp"
          value={newStudent.class}
          onChange={(e) => setNewStudent({ ...newStudent, class: e.target.value })}
        />
        <input
          placeholder="Học phí"
          type="number"
          value={newStudent.fee}
          onChange={(e) => setNewStudent({ ...newStudent, fee: e.target.value })}
        />
        <input
          type="date"
          value={newStudent.date}
          onChange={(e) => setNewStudent({ ...newStudent, date: e.target.value })}
        />
        <button className="btn" onClick={addStudent}>Thêm học sinh</button>
      </div>

      <div className="table-wrap">
        <table className="students-table">
          <thead>
            <tr>
              <th>Tên</th>
              <th>Lớp</th>
              <th>Học phí</th>
              <th>Ngày</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.class}</td>
                <td>{s.fee.toLocaleString()} VND</td>
                <td>{s.date}</td>
                <td>
                  <span className={`status ${s.paid ? "paid" : "unpaid"}`}>
                    {s.paid ? "Đã đóng" : "Chưa đóng"}
                  </span>
                </td>
                <td>
                  <button
                    className={`action-btn ${s.paid ? "toggle-unpaid" : "toggle-paid"}`}
                    onClick={() => togglePaid(s.id)}
                  >
                    {s.paid ? "Hủy đóng" : "Đánh dấu đã đóng"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
