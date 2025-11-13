import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Contest from './pages/Contest'
import LeetcodePage from './pages/LeetcodePage'
import CodechefPage from './pages/CodechefPage'
import CodeforcesPage from './pages/CodeforcesPage'
import Start from './pages/Start'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <>
    <Routes>
      <Route path='/' element={<Start/>} />
      <Route path='/login' element={<Login/>} />
      <Route path='/signup' element={<SignUp/>} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/contest" element={<Contest />} />
      <Route path='/leetcode' element={<LeetcodePage/>}/>
      <Route path='/codechef' element={<CodechefPage/>}/>
      <Route path='/codeforces' element={<CodeforcesPage/>} />
      <Route path='/dashboard' element={<Dashboard />} /> 
    </Routes>
    </>
  )
}

export default App
