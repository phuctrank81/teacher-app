import  LoginPage   from './LoginPage'
import StudentManager from './StudentManager'
import {BrowserRouter ,Routes, Route } from "react-router-dom";

import './App.css'

function App() {
  // const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/student" element={<StudentManager />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
