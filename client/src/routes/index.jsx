import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import Chat from '../pages/Chat'
import Dashboard from '../pages/Dashboard'
import Gamificacao from '../pages/Gamificacao'
import Home from '../pages/Home'
import Insights from '../pages/Insights'
import Questionario from '../pages/Questionario'
import TermosDeUso from '../pages/TermosDeUso'

const termsAcceptedKey = 'mentis-terms-accepted'

function hasAcceptedTerms() {
  return localStorage.getItem(termsAcceptedKey) === 'true'
}

function ProtectedRoute({ children }) {
  if (!hasAcceptedTerms()) {
    return <Navigate to="/termos" replace />
  }

  return children
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/termos" element={<TermosDeUso />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/insights"
          element={
            <ProtectedRoute>
              <Insights />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/questionario"
          element={
            <ProtectedRoute>
              <Questionario />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gamificacao"
          element={
            <ProtectedRoute>
              <Gamificacao />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
