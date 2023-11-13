import './App.css';
import QueueManager from './Attente';
import React from 'react';
import moment from 'moment'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Patient from './Patient';
import PatientList from './ListPatient';
import Topbar from './TopBar';
import MedicationsPage from './MedicationsPage';
import MyAgenda from './Agenda';
import 'moment/locale/fr'  // without this line it didn't work
moment.locale('fr')

function App() {
  return (
    <Router>
      <div>
        <Topbar />
        <Routes>
          <Route path="/agenda" element={<MyAgenda />} />
          <Route path="/medications" element={<MedicationsPage />} />
          <Route path="/" element={<QueueManager />} />
          <Route path="/consultation/:id" element={<Patient />} />
          <Route path="/liste-patients" element={<PatientList />} />
        </Routes>
      </div>
    </Router>

  );
}

export default App;
