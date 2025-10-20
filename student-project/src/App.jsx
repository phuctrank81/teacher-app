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
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setToken(session?.access_token ?? null)
    })

    // Lấy session hiện tại
    supabase.auth.getSession().then(({ data }) => {
      setToken(data.session?.access_token ?? null)
    })

    return () => {
      listener?.subscription?.unsubscribe()
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