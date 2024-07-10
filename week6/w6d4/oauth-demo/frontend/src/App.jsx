import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './Login'
import Dashboard from './Dashboard'

function App() {


  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />        
      </Routes>
    </Router>
  )
}

export default App;
