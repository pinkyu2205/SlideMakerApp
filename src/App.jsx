import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import AdminRoute from './components/Auth/AdminRoute'
import Footer from './components/Layout/Footer/Footer'
import Header from './components/Layout/Header/Header'
import AdminDashboardPage from './pages/Admin/AdminDashboardPage'
import AdminLayout from './pages/Admin/AdminLayout'
import CurriculumManagementPage from './pages/Admin/CurriculumManagementPage'
import UserManagementPage from './pages/Admin/UserManagementPage'
import Login from './pages/AuthPage/Login/Login'
import Register from './pages/AuthPage/Register/Register'
import DashboardPage from './pages/DashboardPage/DashboardPage'
import HomePage from './pages/HomePage/HomePage'
import OptionsTemplatePage from './pages/OptionsTemplatePage/OptionsTemplatePage'
import SlideGeneratorPage from './pages/SlideGeneratorPage/SlideGenerator'
import TemplateLibraryPage from './pages/TemplateLibraryPage/TemplateLibraryPage'

import ForgotPassword from './pages/AuthPage/ForgotPassword/ForgotPassword'
import ProfilePage from './pages/ProfilePage/ProfilePage'

export default function App() {
  const location = useLocation()
  const currentPage = location.pathname
  const isAdminPage = currentPage.startsWith('/admin')
  const showFooter = currentPage === '/' && !isAdminPage

  return (
    <div className='app-container'>
      <Header currentPage={currentPage} />
      <main className='main-content'>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/dashboard' element={<DashboardPage />} />
          <Route path='/templates' element={<TemplateLibraryPage />} />
          <Route path='/options-template' element={<OptionsTemplatePage />} />
          <Route path='/slide-generator' element={<SlideGeneratorPage />} />

          {/* --- Route Quên Mật Khẩu & Profile (Mới thêm) --- */}
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/profile' element={<ProfilePage />} />
        </Routes>

        <Routes element={<AdminRoute />}>
          <Route path='/admin' element={<AdminLayout />}>
            <Route index element={<Navigate to='/admin/dashboard' replace />} />
            <Route path='dashboard' element={<AdminDashboardPage />} />
            <Route path='users' element={<UserManagementPage />} />
            <Route path='curriculum' element={<CurriculumManagementPage />} />
          </Route>
        </Routes>
      </main>
      {showFooter && <Footer />}
    </div>
  )
}
