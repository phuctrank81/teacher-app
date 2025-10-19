import { BrowserRouter, Routes, Route } from "react-router-dom";
import AttendanceTable from "./component/AttendanceTable";
import MonthlyAttendanceHistory from "./component/MonthlyAttendanceHistory";
import Footer from "./component/Footer";
import "./App.css";
import { Signup, Login, SupaBaseTable } from "./component";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";





function App() {

  const [token, setToken] = useState(false)

  if(token){
    sessionStorage.setItem('token',JSON.stringify(token))
  }

  
  useEffect(() => {
    // ✅ Kiểm tra xem localStorage có session không
    const savedSession = localStorage.getItem('supabase_session')
    if (savedSession) {
      const session = JSON.parse(savedSession)
      setToken(session.access_token)
    }

    // ✅ Lắng nghe sự thay đổi session từ Supabase
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setToken(session.access_token)
        localStorage.setItem('supabase_session', JSON.stringify(session))
      } else {
        setToken(null)
        localStorage.removeItem('supabase_session')
      }
    })
  }, [])

  if (!token) {
    return <Login setToken={setToken} />
  }
  
  return (

     

    <div >
      <Routes>
        <Route path = {"/signup"} element={<Signup />}/>
        <Route path={"/"} element={<Login setToken= {setToken} />} />
        {token?<Route path = {"/homepage"} element={<SupaBaseTable token={token} />} />:""}
        <Route path="/attendance" element={<AttendanceTable />} />
        <Route path="/MonthlyAttendanceHistory" element={<MonthlyAttendanceHistory />}/>
        
      </Routes>
      
    </div>
  );
}

export default App;
