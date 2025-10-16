import { BrowserRouter, Routes, Route } from "react-router-dom";
import SupaBaseTable from "./component/supaBaseTable";
import AttendanceTable from "./component/AttendanceTable";
import MonthlyAttendanceHistory from "./component/MonthlyAttendanceHistory";



function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<SupaBaseTable />} />
        <Route path="/attendance" element={<AttendanceTable />} />
        <Route path="/MonthlyAttendanceHistory" element={<MonthlyAttendanceHistory />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
