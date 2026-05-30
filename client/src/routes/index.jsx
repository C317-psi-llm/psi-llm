import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import {
  getAccessToken,
  getStoredUser,
  roleHomeRoute,
} from "../auth/auth";
import RequireAuth from "../auth/RequireAuth";
import RequireRole from "../auth/RequireRole";
import Chat from "../pages/Chat";
import Dashboard from "../pages/Dashboard";
import Gamificacao from "../pages/Gamificacao";
import Home from "../pages/Home";
import Insights from "../pages/Insights";
import Login from "../pages/Login";
import AnalyticsEquipe from "../modules/manager/pages/AnalyticsEquipe";
import ManagerAlertas from "../modules/manager/pages/Alertas";
import ManagerConfiguracoes from "../modules/manager/pages/Configuracoes";
import ManagerPatientDetails from "../modules/manager/pages/PatientDetails";
import ManagerPacientes from "../modules/manager/pages/Pacientes";
import ManagerPainelGeral from "../modules/manager/pages/PainelGeral";
import PrivacidadeDados from "../modules/manager/pages/PrivacidadeDados";
import ManagerPsicologos from "../modules/manager/pages/Psicologos";
import ManagerRelatorios from "../modules/manager/pages/Relatorios";
import AssistenteIA from "../modules/psychologist/pages/AssistenteIA";
import Historico from "../modules/psychologist/pages/Historico";
import PsychologistInsightsPage from "../modules/psychologist/pages/Insights";
import Pacientes from "../modules/psychologist/pages/Pacientes";
import PainelGeral from "../modules/psychologist/pages/PainelGeral";
import PatientDetails from "../modules/psychologist/pages/PatientDetails";
import Questionario from "../pages/Questionario";
import Register from "../pages/Register";
import TermosDeUso from "../pages/TermosDeUso";

function RootRedirect() {
  const token = getAccessToken();
  const user = getStoredUser();

  return (
    <Navigate
      replace
      to={token ? roleHomeRoute(user?.papel) : "/login"}
    />
  );
}

function guardPatient(element) {
  return (
    <RequireAuth>
      <RequireRole allow={["funcionario"]}>{element}</RequireRole>
    </RequireAuth>
  );
}

function guardPsychologist(element) {
  return (
    <RequireAuth>
      <RequireRole allow={["psicologo"]}>{element}</RequireRole>
    </RequireAuth>
  );
}

function guardManager(element) {
  return (
    <RequireAuth>
      <RequireRole allow={["gestor", "admin"]}>{element}</RequireRole>
    </RequireAuth>
  );
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/termos"
          element={
            <RequireAuth>
              <TermosDeUso />
            </RequireAuth>
          }
        />
        <Route path="/patient/home" element={guardPatient(<Home />)} />
        <Route path="/patient/dashboard" element={guardPatient(<Dashboard />)} />
        <Route path="/patient/insights" element={guardPatient(<Insights />)} />
        <Route path="/patient/chat" element={guardPatient(<Chat />)} />
        <Route
          path="/patient/questionario"
          element={guardPatient(<Questionario />)}
        />
        <Route
          path="/patient/gamificacao"
          element={guardPatient(<Gamificacao />)}
        />
        <Route
          path="/psychologist/painel"
          element={guardPsychologist(<PainelGeral />)}
        />
        <Route
          path="/psychologist/pacientes"
          element={guardPsychologist(<Pacientes />)}
        />
        <Route
          path="/psychologist/pacientes/:id"
          element={guardPsychologist(<PatientDetails />)}
        />
        <Route
          path="/psychologist/historico"
          element={guardPsychologist(<Historico />)}
        />
        <Route
          path="/psychologist/insights"
          element={guardPsychologist(<PsychologistInsightsPage />)}
        />
        <Route
          path="/psychologist/assistente"
          element={guardPsychologist(<AssistenteIA />)}
        />
        <Route
          path="/manager/painel"
          element={guardManager(<ManagerPainelGeral />)}
        />
        <Route
          path="/manager/psicologos"
          element={guardManager(<ManagerPsicologos />)}
        />
        <Route
          path="/manager/pacientes"
          element={guardManager(<ManagerPacientes />)}
        />
        <Route
          path="/manager/pacientes/:id"
          element={guardManager(<ManagerPatientDetails />)}
        />
        <Route
          path="/manager/analytics"
          element={guardManager(<AnalyticsEquipe />)}
        />
        <Route
          path="/manager/relatorios"
          element={guardManager(<ManagerRelatorios />)}
        />
        <Route
          path="/manager/alertas"
          element={guardManager(<ManagerAlertas />)}
        />
        <Route
          path="/manager/privacidade"
          element={guardManager(<PrivacidadeDados />)}
        />
        <Route
          path="/manager/configuracoes"
          element={guardManager(<ManagerConfiguracoes />)}
        />

        <Route
          path="/dashboard"
          element={guardPatient(
            <Navigate to="/patient/dashboard" replace />,
          )}
        />
        <Route
          path="/insights"
          element={guardPatient(<Navigate to="/patient/insights" replace />)}
        />
        <Route
          path="/chat"
          element={guardPatient(<Navigate to="/patient/chat" replace />)}
        />
        <Route
          path="/questionario"
          element={guardPatient(
            <Navigate to="/patient/questionario" replace />,
          )}
        />
        <Route
          path="/gamificacao"
          element={guardPatient(
            <Navigate to="/patient/gamificacao" replace />,
          )}
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
