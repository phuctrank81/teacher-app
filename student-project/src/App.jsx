import { BrowserRouter, Routes, Route } from "react-router-dom";
import SupaBaseTable from "./component/SupaBaseTable";
import AttendanceTable from "./component/AttendanceTable";
import MonthlyAttendanceHistory from "./component/MonthlyAttendanceHistory";
import Footer from "./component/Footer";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SupaBaseTable />} />
          <Route path="/attendance" element={<AttendanceTable />} />
          <Route
            path="/MonthlyAttendanceHistory"
            element={<MonthlyAttendanceHistory />}
          />
        </Routes>
         {/* 👈 luôn nằm dưới, xuất hiện ở mọi trang */}
         <Footer />
      </BrowserRouter>
      
    </div>
  );
}

export default App;
