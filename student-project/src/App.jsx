import { Routes, Route, Navigate } from "react-router-dom";
import AttendanceTable from "./pages/AttendanceTablePage/AttendanceTable";
import MonthlyAttendanceHistory from "./pages/MonthlyAttendanceHistory/MonthlyAttendanceHistory";
import DocumentPage from "./pages/DocumentPage/DocumentPage";
import "./App.css";
import { Signup, Login, HomePage, ProfilePage } from "./component";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

function App() {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // chờ init() chạy xong

  useEffect(() => {
    let subscription = null;

    async function init() {
      try {
        const { data } = await supabase.auth.getSession();

        if (data?.session) {
          setToken(data.session.access_token);
          localStorage.setItem("supabase_session", JSON.stringify(data.session));
        } else {
          const saved = localStorage.getItem("supabase_session");
          if (saved) {
            const savedSession = JSON.parse(saved);
            await supabase.auth.setSession({
              access_token: savedSession.access_token,
              refresh_token: savedSession.refresh_token,
            });
            const { data: newData } = await supabase.auth.getSession();
            if (newData?.session) {
              setToken(newData.session.access_token);
              localStorage.setItem("supabase_session", JSON.stringify(newData.session));
            }
          }
        }
      } catch (err) {
        console.error("Error while restoring session:", err);
      } finally {
        setLoading(false);
      }
    }

    init();

    const res = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setToken(session.access_token);
        localStorage.setItem("supabase_session", JSON.stringify(session));
      } else {
        setToken(null);
        localStorage.removeItem("supabase_session");
      }
    });

    if (res?.data?.subscription) {
      subscription = res.data.subscription;
    }

    return () => {
      if (subscription && typeof subscription.unsubscribe === "function") {
        subscription.unsubscribe();
      }
    };
  }, []);

  // Hiển thị loading khi chưa xác định session
  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <Routes>
        {/* Nếu đã đăng nhập -> tự động chuyển sang homepage */}
        <Route
          path="/"
          element={token ? <Navigate to="/homepage" /> : <Login setToken={setToken} />}
        />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/homepage"
          element={token ? <HomePage token={token} /> : <Navigate to="/" />}
        />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/attendance" element={<AttendanceTable />} />
        <Route path="/MonthlyAttendanceHistory" element={<MonthlyAttendanceHistory />} />
        <Route path="/DocumentPage" element={<DocumentPage />} />
      </Routes>
    </div>
  );
}

export default App;
