```javascript
import React from 'react';

const PatientPage = ({ patient }) => (
  <div className="patient-info-card">
    <div className="patient-photo">
      <img src={patient.photoUrl || "/default-patient.png"} alt="Patient" style={{width: 120, height: 120, borderRadius: '50%'}} />
    </div>
    <div className="patient-details">
      <h2>{patient.name}</h2>
      <p><strong>ID:</strong> {patient.id}</p>
      <p><strong>Age:</strong> {patient.age}</p>
      <p><strong>Gender:</strong> {patient.gender}</p>
      <p><strong>Address:</strong> {patient.address}</p>
      {/* Add more fields as needed */}
    </div>
  </div>
);

export default PatientPage;
```