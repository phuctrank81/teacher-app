import { Routes, Route, useNavigate } from "react-router-dom";
import AttendanceTable from "./component/AttendanceTable";
import MonthlyAttendanceHistory from "./component/MonthlyAttendanceHistory";
import "./App.css";
import { Signup, Login, HomePage } from "./component";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

function App() {
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ 1. Kiểm tra session có sẵn (Supabase tự quản lý trong cookie)
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    // ✅ 2. Lắng nghe thay đổi đăng nhập / đăng xuất
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession) {
        navigate("/homepage");
      } else {
        navigate("/");
      }
    });

    // ✅ 3. Cleanup khi component bị unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  // ✅ Nếu chưa đăng nhập → Hiện Login
  if (!session) {
    return <Login setToken={() => {}} />;
  }

  return (
    <div>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Login setToken={() => {}} />} />
        <Route path="/homepage" element={<HomePage token={session.access_token} />} />
        <Route path="/attendance" element={<AttendanceTable />} />
        <Route path="/MonthlyAttendanceHistory" element={<MonthlyAttendanceHistory />} />
      </Routes>
    </div>
  );
}

export default App;
