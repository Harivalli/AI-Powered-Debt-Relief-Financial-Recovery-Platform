import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/AppLayout';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProfileSetup from './pages/ProfileSetup';
import Debts from './pages/Debts';
import Expenses from './pages/Expenses';
import AIAnalysis from './pages/AIAnalysis';
import RepaymentPlanner from './pages/RepaymentPlanner';
import Reports from './pages/Reports';
import Account from './pages/Account';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile-setup" element={<ProfileSetup />} />
            <Route path="/debts" element={<Debts />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/ai-analysis" element={<AIAnalysis />} />
            <Route path="/repayment-planner" element={<RepaymentPlanner />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/account" element={<Account />} />
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
