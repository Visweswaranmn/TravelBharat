import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import PublicLayout from './layouts/PublicLayout'
import AdminLayout from './layouts/AdminLayout'
import ProtectedRoute from './routes/ProtectedRoute'
import AdminRoute from './routes/AdminRoute'
import Home from './pages/public/Home'
import Login from './pages/public/Login'
import Register from './pages/public/Register'
import MyAccount from './pages/public/MyAccount'
import ExploreIndia from './pages/public/ExploreIndia'
import StateDetails from './pages/public/StateDetails'
import CityDetails from './pages/public/CityDetails'
import DestinationDetails from './pages/public/DestinationDetails'
import Search from './pages/public/Search'
import CategoryList from './pages/public/CategoryList'
import CategoryDetail from './pages/public/CategoryDetail'
import AdminLogin from './pages/admin/AdminLogin'
import Dashboard from './pages/admin/Dashboard'
import Profile from './pages/admin/Profile'
import ComingSoon from './pages/admin/ComingSoon'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-center" />
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<ExploreIndia />} />
            <Route path="/states/:stateSlug" element={<StateDetails />} />
            <Route path="/states/:stateSlug/:citySlug" element={<CityDetails />} />
            <Route path="/destinations/:slug" element={<DestinationDetails />} />
            <Route path="/search" element={<Search />} />
            <Route path="/categories" element={<CategoryList />} />
            <Route path="/categories/:categorySlug" element={<CategoryDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <MyAccount />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="/admin/login" element={<AdminLogin />} />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="states" element={<ComingSoon title="Manage States" />} />
            <Route path="cities" element={<ComingSoon title="Manage Cities" />} />
            <Route path="destinations" element={<ComingSoon title="Manage Destinations" />} />
            <Route path="categories" element={<ComingSoon title="Manage Categories" />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
