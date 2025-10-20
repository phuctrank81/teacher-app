import { Routes, Route } from "react-router-dom";
import AttendanceTable from "./component/AttendanceTable";
import MonthlyAttendanceHistory from "./component/MonthlyAttendanceHistory";
import "./App.css";
import { Signup, Login, HomePage } from "./component";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

function App() {

  // null = chưa xác định / chưa có session; string = token; null (explicit) khi đăng xuất
  const [token, setToken] = useState(null)

  useEffect(() => {
    let subscription = null

    async function init() {
      try {
        // Thử lấy session trực tiếp từ Supabase client
        const { data } = await supabase.auth.getSession()
        if (data?.session) {
          // Có session hợp lệ
          setToken(data.session.access_token)
          localStorage.setItem('supabase_session', JSON.stringify(data.session))
          return
        }

        // Nếu supabase client không có session (ví dụ page load mới),
        // fallback: thử lấy session đã lưu trong localStorage và khôi phục
        const saved = localStorage.getItem('supabase_session')
        if (saved) {
          const savedSession = JSON.parse(saved)
          // Khôi phục session tại client Supabase (gửi cả access & refresh nếu có)
          await supabase.auth.setSession({
            access_token: savedSession.access_token,
            refresh_token: savedSession.refresh_token
          })
          // Lấy lại session mới từ supabase
          const { data: newData } = await supabase.auth.getSession()
          if (newData?.session) {
            setToken(newData.session.access_token)
            localStorage.setItem('supabase_session', JSON.stringify(newData.session))
            return
          }
        }
      } catch (err) {
        console.error('Error while restoring session:', err)
      }
    }

    init()

    // Lắng nghe thay đổi auth state
    const res = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setToken(session.access_token)
        localStorage.setItem('supabase_session', JSON.stringify(session))
      } else {
        setToken(null)
        localStorage.removeItem('supabase_session')
      }
    })

    // onAuthStateChange trả về object chứa subscription tuỳ version; cleanup khi unmount
    if (res?.data?.subscription) {
      subscription = res.data.subscription
    }

    return () => {
      if (subscription && typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe()
      }
    }
  }, [])

  // Nếu chưa có token => hiện login
  if (!token) {
    return <Login setToken={setToken} />
  }

  return (
      <div >
        <Routes>
          <Route path={"/signup"} element={<Signup />} />
          <Route path={"/"} element={<Login setToken={setToken} />} />
          {token ? <Route path={"/homepage"} element={<HomePage token={token} />} /> : null}
          <Route path="/attendance" element={<AttendanceTable />} />
          <Route path="/MonthlyAttendanceHistory" element={<MonthlyAttendanceHistory />} />
        </Routes>
      </div>
  );
}

export default App;