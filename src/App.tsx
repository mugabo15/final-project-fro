import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/landingPage';
import Dashboard from './pages/Dashboard';
import Login from './components/login';
import SignUpForm from './components/register';
import RecomandationLetter from './components/forms/Recomandation';
import Settings from './components/adminDas/settings';
import AdminUsers from './components/adminDas/users';
import RequstedDocs from './components/DeanDash/requests';
import DeanSettings from './components/DeanDash/deanSettings';
import HRequstedDocs from './components/HodDash/requests';

import HodSettings from './components/HodDash/deanSettings';
import Requests from './components/StudentDash/RequestPage';
import LetterDraftingComponent from './components/HodDash/letter';




export default function App() {
  return (
    <Router>
      
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<SignUpForm />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/users" element={<AdminUsers />} />
          <Route path="/requested-docs" element={<RequstedDocs />} />
          <Route path="/dean-settings" element={<DeanSettings />} />
          <Route path="/hod-requested-docs" element={<HRequstedDocs />} />

          <Route path="/hod-settings" element={<HodSettings />} />
          <Route path="/my-request" element={<Requests />} />
          <Route path="/recomandation" element={<LetterDraftingComponent />} />









          <Route path="/recomandation" element={<RecomandationLetter/>} />

        </Routes>
    </Router>
  );
}
