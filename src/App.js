import './App.css';
import QueueManager from './Attente';
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Patient from './Patient';
import PatientList from './ListPatient';
import Topbar from './TopBar';
import MedicationsPage from './MedicationsPage';
import MyAgenda from './Agenda';

function App() {
  return (
    <Router>
      <div>
        <Topbar />
        <Routes>
          <Route path="/agenda" element={<MyAgenda />} />
          <Route path="/medications" element={<MedicationsPage />} />
          <Route path="/file-attente" element={<QueueManager />} />
          <Route path="/consultation/:id" element={<Patient />} />
          <Route path="/liste-patients" element={<PatientList />} />
        </Routes>
      </div>
    </Router>

  );
}

export default App;
