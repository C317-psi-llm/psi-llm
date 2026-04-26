import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import Chat from '../pages/Chat'
import Dashboard from '../pages/Dashboard'
import Gamificacao from '../pages/Gamificacao'
import Home from '../pages/Home'
import Insights from '../pages/Insights'
import Login from '../pages/Login'
import AnalyticsEquipe from '../modules/manager/pages/AnalyticsEquipe'
import ManagerAlertas from '../modules/manager/pages/Alertas'
import ManagerConfiguracoes from '../modules/manager/pages/Configuracoes'
import ManagerPacientes from '../modules/manager/pages/Pacientes'
import ManagerPainelGeral from '../modules/manager/pages/PainelGeral'
import PrivacidadeDados from '../modules/manager/pages/PrivacidadeDados'
import ManagerPsicologos from '../modules/manager/pages/Psicologos'
import ManagerRelatorios from '../modules/manager/pages/Relatorios'
import AssistenteIA from '../modules/psychologist/pages/AssistenteIA'
import Historico from '../modules/psychologist/pages/Historico'
import PsychologistInsightsPage from '../modules/psychologist/pages/Insights'
import Pacientes from '../modules/psychologist/pages/Pacientes'
import PainelGeral from '../modules/psychologist/pages/PainelGeral'
import PatientDetails from '../modules/psychologist/pages/PatientDetails'
import Questionario from '../pages/Questionario'
import Register from '../pages/Register'
import TermosDeUso from '../pages/TermosDeUso'

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/termos" element={<TermosDeUso />} />
        <Route path="/patient/home" element={<Home />} />
        <Route path="/patient/dashboard" element={<Dashboard />} />
        <Route path="/patient/insights" element={<Insights />} />
        <Route path="/patient/chat" element={<Chat />} />
        <Route path="/patient/questionario" element={<Questionario />} />
        <Route path="/patient/gamificacao" element={<Gamificacao />} />
        <Route path="/psychologist/painel" element={<PainelGeral />} />
        <Route path="/psychologist/pacientes" element={<Pacientes />} />
        <Route path="/psychologist/pacientes/:id" element={<PatientDetails />} />
        <Route path="/psychologist/historico" element={<Historico />} />
        <Route path="/psychologist/insights" element={<PsychologistInsightsPage />} />
        <Route path="/psychologist/assistente" element={<AssistenteIA />} />
        <Route path="/manager/painel" element={<ManagerPainelGeral />} />
        <Route path="/manager/psicologos" element={<ManagerPsicologos />} />
        <Route path="/manager/pacientes" element={<ManagerPacientes />} />
        <Route path="/manager/analytics" element={<AnalyticsEquipe />} />
        <Route path="/manager/relatorios" element={<ManagerRelatorios />} />
        <Route path="/manager/alertas" element={<ManagerAlertas />} />
        <Route path="/manager/privacidade" element={<PrivacidadeDados />} />
        <Route path="/manager/configuracoes" element={<ManagerConfiguracoes />} />

        <Route path="/dashboard" element={<Navigate to="/patient/dashboard" replace />} />
        <Route path="/insights" element={<Navigate to="/patient/insights" replace />} />
        <Route path="/chat" element={<Navigate to="/patient/chat" replace />} />
        <Route path="/questionario" element={<Navigate to="/patient/questionario" replace />} />
        <Route path="/gamificacao" element={<Navigate to="/patient/gamificacao" replace />} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
