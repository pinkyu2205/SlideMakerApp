import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import Footer from './components/Layout/Footer/Footer'
import Header from './components/Layout/Header/Header'
import ForgotPassword from './pages/AuthPage/ForgotPassword/ForgotPassword'
import ResetPassword from './pages/AuthPage/ForgotPassword/ResetPassword'
import Login from './pages/AuthPage/Login/Login'
import Register from './pages/AuthPage/Register/Register'
import DashboardPage from './pages/DashboardPage/DashboardPage'
import HomePage from './pages/HomePage/HomePage'
import ProfilePage from './pages/ProfilePage/ProfilePage'
import TemplateLibraryPage from './pages/TemplateLibraryPage/TemplateLibraryPage'

// Import các trang Admin (Đảm bảo bạn đã import đầy đủ)
import AdminRoute from './components/Auth/AdminRoute'
import AdminDashboardPage from './pages/Admin/AdminDashboardPage'
import AdminLayout from './pages/Admin/AdminLayout'
import CurriculumManagementPage from './pages/Admin/CurriculumManagementPage'
import TemplateAdminPage from './pages/Admin/TemplateAdminPage'
import UserManagementPage from './pages/Admin/UserManagementPage'
import OptionsTemplatePage from './pages/OptionsTemplatePage/OptionsTemplatePage'
import SlideGeneratorPage from './pages/SlideGeneratorPage/SlideGenerator'

export default function App() {
  const location = useLocation()
  const currentPage = location.pathname

  const isAdminPage = currentPage.startsWith('/admin')

  const showFooter = currentPage === '/' && !isAdminPage

  return (
    <div className='app-container'>
      {!isAdminPage && <Header currentPage={currentPage} />}

      <main className='main-content'>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/dashboard' element={<DashboardPage />} />
          <Route path='/templates' element={<TemplateLibraryPage />} />
          <Route path='/options-template' element={<OptionsTemplatePage />} />
          <Route path='/slide-generator' element={<SlideGeneratorPage />} />

          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/profile' element={<ProfilePage />} />
          <Route path='/reset-password' element={<ResetPassword />} />

          <Route element={<AdminRoute />}>
            <Route path='/admin' element={<AdminLayout />}>
              <Route
                index
                element={<Navigate to='/admin/dashboard' replace />}
              />
              <Route path='dashboard' element={<AdminDashboardPage />} />
              <Route path='users' element={<UserManagementPage />} />
              <Route path='curriculum' element={<CurriculumManagementPage />} />
              <Route path='templates-ppt' element={<TemplateAdminPage />} />
            </Route>
          </Route>
        </Routes>
      </main>

      {showFooter && <Footer />}
    </div>
  )
}
