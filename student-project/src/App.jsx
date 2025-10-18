import { BrowserRouter, Routes, Route } from "react-router-dom";
import AttendanceTable from "./component/AttendanceTable";
import MonthlyAttendanceHistory from "./component/MonthlyAttendanceHistory";
import Footer from "./component/Footer";
import "./App.css";
import { Signup, Login, SupaBaseTable } from "./component";
import { useEffect, useState } from "react";





function App() {

  const [token, setToken] = useState(false)

  if(token){
    sessionStorage.setItem('token',JSON.stringify(token))
  }

  useEffect(() => {
    if(sessionStorage.getItem('token')){
      let data = JSON.parse(sessionStorage.getItem('token'))
      setToken(data)
    }


  }, [])
  
  return (
    // <div className="app-container">
    //   <BrowserRouter>
    //     <Routes>
    //       <Route path="/" element={<SupaBaseTable />} />
    //       <Route path="/attendance" element={<AttendanceTable />} />
           
    //     </Routes>
    //      
    //      <Footer />
    //   </BrowserRouter>

    // </div>

     

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
