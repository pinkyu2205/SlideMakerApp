import { Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import Footer from './components/Layout/Footer/Footer'
import Header from './components/Layout/Header/Header'
import Login from './pages/AuthPage/Login/Login'
import Register from './pages/AuthPage/Register/Register'
import DashboardPage from './pages/DashboardPage/DashboardPage'
import HomePage from './pages/HomePage/HomePage'

export default function App() {
  const location = useLocation()
  const currentPage = location.pathname

  return (
    <div className='app-container'>
      <Header currentPage={currentPage} />
      <main className='main-content'>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/dashboard' element={<DashboardPage />} />
        </Routes>
      </main>
      {currentPage === '/' && <Footer />}
    </div>
  )
}
