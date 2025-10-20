import { Routes, Route, useNavigate } from "react-router-dom";
import AttendanceTable from "./component/AttendanceTable";
import MonthlyAttendanceHistory from "./component/MonthlyAttendanceHistory";
import "./App.css";
import { Signup, Login, HomePage } from "./component";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

function App() {
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ Lắng nghe sự thay đổi đăng nhập / đăng xuất
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const accessToken = session?.access_token ?? null;
      setToken(accessToken);

      if (accessToken) {
        navigate("/homepage"); // 👉 Đã đăng nhập thì chuyển đến homepage
      } else {
        navigate("/"); // 👉 Nếu đăng xuất thì quay về login
      }
    });

    // ✅ Lấy session hiện tại (nếu đã đăng nhập trước đó)
    supabase.auth.getSession().then(({ data }) => {
      const accessToken = data.session?.access_token ?? null;
      setToken(accessToken);

      if (accessToken) {
        navigate("/homepage"); // 👉 Tự động chuyển homepage nếu đã login
      }
    });

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, [navigate]);

  // ✅ Nếu chưa đăng nhập => hiện Login
  if (!token) {
    return <Login setToken={setToken} />;
  }

  return (
    <div>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Login setToken={setToken} />} />
        <Route path="/homepage" element={<HomePage token={token} />} />
        <Route path="/attendance" element={<AttendanceTable />} />
        <Route path="/MonthlyAttendanceHistory" element={<MonthlyAttendanceHistory />} />
      </Routes>
    </div>
  );
}

export default App;
