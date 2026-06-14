import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from '@/pages/Home';
import Questionnaire from '@/pages/Questionnaire';
import ProductList from '@/pages/ProductList';
import ProductDetail from '@/pages/ProductDetail';
import Compare from '@/pages/Compare';
import Consultants from '@/pages/Consultants';
import Login from '@/pages/Login';
import DashboardHome from '@/pages/dashboard/DashboardHome';
import DashboardFavorites from '@/pages/dashboard/DashboardFavorites';
import DashboardAppointments from '@/pages/dashboard/DashboardAppointments';
import DashboardCommunications from '@/pages/dashboard/DashboardCommunications';
import DashboardReviews from '@/pages/dashboard/DashboardReviews';
import DashboardSettings from '@/pages/dashboard/DashboardSettings';
import ProviderHome from '@/pages/provider/ProviderHome';
import ProviderProducts from '@/pages/provider/ProviderProducts';
import ProviderAppointments from '@/pages/provider/ProviderAppointments';
import ProviderCases from '@/pages/provider/ProviderCases';
import ProviderInquiries from '@/pages/provider/ProviderInquiries';
import ProviderReviews from '@/pages/provider/ProviderReviews';
import ProviderSettings from '@/pages/provider/ProviderSettings';
import { useAppStore } from '@/store/useAppStore';

function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode; requiredRole?: string }) {
  const { isLoggedIn, userRole } = useAppStore();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/questionnaire" element={<Questionnaire />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/consultants" element={<Consultants />} />
        <Route path="/login" element={<Login />} />

        {/* Merchant Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requiredRole="merchant">
              <DashboardHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/favorites"
          element={
            <ProtectedRoute requiredRole="merchant">
              <DashboardFavorites />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/appointments"
          element={
            <ProtectedRoute requiredRole="merchant">
              <DashboardAppointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/communications"
          element={
            <ProtectedRoute requiredRole="merchant">
              <DashboardCommunications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/reviews"
          element={
            <ProtectedRoute requiredRole="merchant">
              <DashboardReviews />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/settings"
          element={
            <ProtectedRoute requiredRole="merchant">
              <DashboardSettings />
            </ProtectedRoute>
          }
        />

        {/* Provider Dashboard Routes */}
        <Route
          path="/provider"
          element={
            <ProtectedRoute requiredRole="provider">
              <ProviderHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/provider/products"
          element={
            <ProtectedRoute requiredRole="provider">
              <ProviderProducts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/provider/appointments"
          element={
            <ProtectedRoute requiredRole="provider">
              <ProviderAppointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/provider/reviews"
          element={
            <ProtectedRoute requiredRole="provider">
              <ProviderReviews />
            </ProtectedRoute>
          }
        />
        <Route
          path="/provider/cases"
          element={
            <ProtectedRoute requiredRole="provider">
              <ProviderCases />
            </ProtectedRoute>
          }
        />
        <Route
          path="/provider/inquiries"
          element={
            <ProtectedRoute requiredRole="provider">
              <ProviderInquiries />
            </ProtectedRoute>
          }
        />
        <Route
          path="/provider/settings"
          element={
            <ProtectedRoute requiredRole="provider">
              <ProviderSettings />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
