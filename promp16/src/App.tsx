import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import IssueList from './pages/IssueList';
import IssueNew from './pages/IssueNew';
import IssueDetail from './pages/IssueDetail';
import DutySchedule from './pages/DutySchedule';
import Contacts from './pages/Contacts';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/issues" replace />} />
        <Route path="/issues" element={<IssueList />} />
        <Route path="/issues/new" element={<IssueNew />} />
        <Route path="/issues/:id" element={<IssueDetail />} />
        <Route path="/duty" element={<DutySchedule />} />
        <Route path="/contacts" element={<Contacts />} />
      </Routes>
    </BrowserRouter>
  );
}
