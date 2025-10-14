import { BrowserRouter, Routes, Route } from "react-router-dom";
import SupaBaseTable from "./component/supaBaseTable";
import AttendanceTable from "./component/AttendanceTable";
// import LoginPage from "./component/LoginPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<LoginPage />} /> */}
        <Route path="/" element={<SupaBaseTable />} />
        <Route path="/attendance" element={<AttendanceTable />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
