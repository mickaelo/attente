import './App.css';
import QueueManager from './Attente';
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Patient from './Patient';
import PatientList from './ListPatient';
import Topbar from './TopBar';

function App() {
  return (
    <Router>
      <div>
        <Topbar />
        <Routes>
          <Route path="/file-attente" element={<QueueManager />} />
          <Route path="/patient" element={<Patient />} />
          <Route path="/liste-patients" element={<PatientList />} />
        </Routes>
      </div>
    </Router>

  );
}

export default App;
