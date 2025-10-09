import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import StudentManager from './StudentManager.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StudentManager />
  </StrictMode>,
)
